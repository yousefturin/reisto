import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SvgComponent from "../../utils/SvgComponents";
import initializeScalingUtils from "../../utils/NormalizeSize"
import { Divider } from 'react-native-elements';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculator';
import { LinearGradient } from 'expo-linear-gradient';
import { firebase, db } from '../../firebase'
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import ReactNativeModal from 'react-native-modal';
import { ModalContentForUserWithDifferentSameId, ModalContentForUserWithSameId, ModalHeader } from './Modals';
import { GenerateRoomId } from '../../utils/GenerateChatId';
import { addDoc, collection } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get('window').height;
const { moderateScale } = initializeScalingUtils(Dimensions);
const Icons = [
    {
        active: 'LikeActiveSVG',
        notActive: 'LikeNotActiveSVG'
    },
    {
        name: 'CommentSVG'
    },
    {
        name: 'ShareSVG'
    },
    {
        active: 'BookmarkActiveSVG',
        notActive: 'BookmarkNotActiveSVG'
    },
]
//#region Post
const Post = ({ post, userData, isLastPost, usersForSharePosts, theme, shouldAddOffSet }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isContainerVisible, setContainerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAlertModaVisible, setIsAlertModaVisible] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [savedPosts, setSavedPosts] = useState([])
    const [sharePostModal, setSharePostModal] = useState(false);

    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };
    const toggleContainer = () => {
        setContainerVisible(!isContainerVisible);
    };
    // if the currentUser is included in the likes_by_users array then negate the state otherwise make it positive 
    const handleLike = post => {
        const currentLikeStatus = !post.likes_by_users.includes(
            firebase.auth().currentUser.email
        )
        db.collection('users')
            .doc(post.owner_email)
            .collection('posts')
            .doc(post.id)
            .update({
                likes_by_users: currentLikeStatus ? firebase.firestore.FieldValue.arrayUnion(
                    firebase.auth().currentUser.email
                )
                    : firebase.firestore.FieldValue.arrayRemove(
                        firebase.auth().currentUser.email
                    ),
            }).then(() => {
                console.log('Document successfully updated likes!')
            }).catch(error => {
                console.error('Error updating document: ', error)
            })
    }
    const handleComment = (post, commentText, setCommentText) => {
        const time = {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: (Date.now() % 1000) * 1e6
        }
        const commentData = {
            username: userData.username,
            comment: commentText,
            profile_picture: userData.profile_picture,
            createdAt: time,
        }
        db.collection('users')
            .doc(post.owner_email)
            .collection('posts')
            .doc(post.id)
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentData)
            }).then(() => {
                console.log('Document successfully updated comments!')
            }).catch(error => {
                console.error('Error updating document: ', error)
            })
    }
    useEffect(() => {
        getUserSavedPosts();
    }, []);

    const getUserSavedPosts = async () => {
        try {
            const currentUserEmail = firebase.auth().currentUser.email;
            const userDocRef = db.collection('users').doc(currentUserEmail);
            const savedPostsQuerySnapshot = await userDocRef.collection('saved_post').get();
            if (!savedPostsQuerySnapshot.empty) {
                const data = savedPostsQuerySnapshot.docs[0].data();
                setSavedPosts({
                    id: savedPostsQuerySnapshot.docs[0].id,
                    saved_post_id: data.saved_post_id || [] // Assuming saved_post_id is an array
                });
            } else {
                console.log('No saved posts found for this user.');
                setSavedPosts({ id: null, saved_post_id: [] });
            }
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        }
    };

    const handleSavedPost = post => {
        const currentSavedPostStatus = !savedPosts.saved_post_id.includes(post.id);
        try {
            db.collection('users')
                .doc(firebase.auth().currentUser.email)
                .collection('saved_post')
                .doc(savedPosts.id)
                .update({
                    saved_post_id: currentSavedPostStatus ?
                        firebase.firestore.FieldValue.arrayUnion(post.id)
                        :
                        firebase.firestore.FieldValue.arrayRemove(
                            post.id
                        ),
                })
            console.log('Document successfully updated!');
            // Update state only if the operation succeeds
            setSavedPosts(prevState => ({
                ...prevState,
                saved_post_id: currentSavedPostStatus ?
                    [...prevState.saved_post_id, post.id] :
                    prevState.saved_post_id.filter(savedId => savedId !== post.id)
            }));
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };
    const [selectedPostToShare, setSelectedPostToShare] = useState({});
    const [isButtonSharePressed, setIsButtonSharePressed] = useState(false);
    const [userToBeSharedPostWith, setUserToBeSharedPostWith] = useState({});
    const [userIndex, setUserIndex] = useState(null);
    const handleSharePostToggle = (post) => {
        // open modal, since the useState of setSharePostModal is considered bad code.So it is made from the Post component.
        setSharePostModal(true);
        const { category, captionIngredients,
            captionInstructions, comments,
            createdAt, likes_by_users,
            timeOfMake, ...postToShare } = post;

        setSelectedPostToShare(postToShare);
    }
    const handleSharingPost = (user, index) => {
        setUserToBeSharedPostWith(user);
        setUserIndex(index)
    }
    const handleCreateChat = async () => {
        let roomId = GenerateRoomId(userData.owner_uid, userToBeSharedPostWith.owner_uid);
        try {
            const roomRef = db.collection('messages').doc(roomId);
            const roomSnap = await roomRef.get();

            if (!roomSnap.exists) { // Check if the document exists
                await roomRef.set({
                    roomId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    // first owner1 will always be the current user this is used in the main screen for messages to show the user who sent the message
                    owner1: userData.email,
                    owner2: userToBeSharedPostWith.email,
                });
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }
    const handleShareMessage = async () => {
        // this is the function that will be used to share the post to the user
        // the post that is selected to be shared is selectedPostToShare
        // the user that is selected to be shared with is userToBeSharedPostWith

        let imageToBeSent = null
        let Post_Shared_id = selectedPostToShare
        let messagePurpose = "share_post"
        let message = null

        handleCreateChat()
        setSharePostModal(false);

        try {
            let roomId = GenerateRoomId(userData.owner_uid, userToBeSharedPostWith.owner_uid);
            const DocRef = db.collection('messages').doc(roomId)
            const messagesRef = collection(DocRef, "private_messages");
            //clear the message after it send
            const newDoc = await addDoc(messagesRef, {
                owner_id: userData?.owner_uid,
                text: message,
                type_of_message: messagePurpose,
                image: imageToBeSent,
                shared_data: Post_Shared_id,
                profile_picture: userData?.profile_picture,
                sender_name: userData?.username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seenBy: [userData?.owner_uid]
            })
        } catch (error) {
            Alert.alert(error.message);
        } finally {
            console.log("Message Sent")
        }
    }


    return (
        <View style={{ paddingBottom: isLastPost ? 55 : 30 }}>
            <PostHeader post={post} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}
                userData={userData} handleSavedPost={handleSavedPost}
                savedPosts={savedPosts}
                isAlertModaVisible={isAlertModaVisible} setIsAlertModaVisible={setIsAlertModaVisible}
                theme={theme} />
            <PostImage post={post} handleLike={handleLike} theme={theme} />
            <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                <PostFooter toggleContainer={toggleContainer} post={post} handleLike={handleLike} handleSavedPost={handleSavedPost}
                    savedPosts={savedPosts} handleSharePostToggle={handleSharePostToggle}
                    setSharePostModal={setSharePostModal} sharePostModal={sharePostModal} theme={theme} />
                <Likes post={post} theme={theme} t={t} />
                <CategoryAndTime post={post} theme={theme} t={t} />
                <Caption post={post} isExpanded={isExpanded} toggleCaption={toggleCaption} theme={theme} t={t} />
                {!!post.comments.length ?
                    <TouchableOpacity onPress={toggleContainer}>
                        <CommentSection post={post} theme={theme} t={t} />
                    </TouchableOpacity> : null
                }

                <Comments post={post} setContainerVisible={setContainerVisible} handleComment={handleComment}
                    setCommentText={setCommentText} commentText={commentText} theme={theme}
                    isContainerVisible={isContainerVisible} userData={userData} t={t} />
                <TimeStamp post={post} theme={theme} t={t} />
                {/* Default name is Modal but since i have another Modal imported i used the parent name  */}
                <ReactNativeModal
                    isVisible={isModalVisible}
                    onSwipeComplete={() => setIsModalVisible(false)}
                    onBackdropPress={() => setIsModalVisible(false)}
                    swipeDirection="down"
                    swipeThreshold={170}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                        // there is no other way to create double nested Modals and hide 
                        // one then display the other so the only bad solution is to make the opacity removed--<<<<<<<<<<<<<<<- (needs more study for a better solution)
                        opacity: isAlertModaVisible ? 0 : 1
                    }}>
                    <View style={{
                        backgroundColor: theme.SubPrimary,
                        height: userData.owner_uid === post.owner_uid ? screenHeight * 0.4 : screenHeight * 0.33,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20
                    }}>
                        <ModalHeader theme={theme} />
                        {/* this component is only allowed for the users that own the post  else will have different data to be shown.*/}
                        {userData.owner_uid === post.owner_uid ? (
                            <ModalContentForUserWithSameId handleSavedPost={handleSavedPost} theme={theme}
                                savedPosts={savedPosts} post={post} setIsModalVisible={setIsModalVisible}
                                isAlertModaVisible={isAlertModaVisible} setIsAlertModaVisible={setIsAlertModaVisible} t={t} />
                        ) : (
                            <ModalContentForUserWithDifferentSameId handleSavedPost={handleSavedPost} savedPosts={savedPosts}
                                post={post} setIsModalVisible={setIsModalVisible} theme={theme} t={t} />
                        )
                        }
                    </View>
                </ReactNativeModal>
                <ReactNativeModal
                    isVisible={sharePostModal}
                    onSwipeComplete={() => setSharePostModal(false)}
                    onBackdropPress={() => setSharePostModal(false)}
                    swipeDirection="down"
                    swipeThreshold={170}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}>
                    <View style={{
                        backgroundColor: theme.SubPrimary,
                        height: screenHeight * 0.4,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20
                    }}>
                        <ModalHeader theme={theme} />
                        <View style={{ justifyContent: "space-between" }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 30, marginHorizontal: 20, height: "65%", }}>
                                {/* needs better implementation for the UI */}
                                {usersForSharePosts.map((user, index) => (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                        setIsButtonSharePressed(userIndex === index ? false : true);
                                        handleSharingPost(user, index);
                                    }}
                                        key={index} style={{ width: '33.33%', paddingHorizontal: 20, }}>
                                        <Image
                                            source={{ uri: user.profile_picture }}
                                            style={{
                                                width: '100%', aspectRatio: 1, borderRadius: 50, borderWidth: 1,
                                                borderColor: userIndex === index && isButtonSharePressed ? theme.appSecondary : theme.Secondary, position: "relative",
                                                zIndex: 1
                                            }}
                                            contentFit='cover'
                                        />
                                        {userIndex === index && isButtonSharePressed && (
                                            <View style={{ position: "absolute", top: 10, right: 15, zIndex: 2 }}>
                                                <SvgComponent svgKey="DotWithCheckSVG" width={moderateScale(22)} height={moderateScale(22)} fill={theme.textPrimary} />
                                            </View>
                                        )}
                                        <Text style={{ textAlign: "center", color: theme.textSecondary, marginVertical: 10 }}>{user.username}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={{ marginHorizontal: 10 }}>
                                {isButtonSharePressed && (
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => { handleShareMessage() }}>
                                        <LinearGradient
                                            colors={[theme.appPrimary, theme.appSubPrimary, theme.appPrimary]}
                                            start={{ x: 0, y: 0 }} // Define the start point (top-left corner)
                                            end={{ x: 1, y: 0 }}   // Define the end point (top-right corner)
                                            locations={[0, 0.5, 1]} // Adjust the positions of color stops
                                            style={{
                                                width: "100%",
                                                height: 40,
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                            <Text style={{
                                                color: theme.textPrimary,
                                                textAlign: 'center',
                                            }}>{t('screens.home.text.share')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </ReactNativeModal>
            </View>
        </View>
    )
}
//#endregion

//#region  Time display
const TimeStamp = ({ post, theme, t }) => (
    post.createdAt && (
        <View style={{ marginTop: 5 }}>
            <Text style={{ color: theme.textSecondary }}>
                {calculateTimeDifference(post.createdAt, t)}{' '}{t('screens.home.text.TimeStamp')}
            </Text>
        </View>
    )
)
//#endregion

//#region Post Header
const PostHeader = ({ post, isModalVisible, setIsModalVisible, userData, theme }) => {
    const navigation = useNavigation();

    const GetPostOwnerData = (post) => {
        return new Promise((resolve, reject) => {
            const unsubscribe = db.collection('users').where('owner_uid', '==', post.owner_uid).limit(1).onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => doc.data())[0];
                const userDataToBeNavigated = {
                    username: data.username,
                    profile_picture: data.profile_picture,
                    displayed_name: data.displayed_name,
                    bio: data.bio,
                    link: data.link,
                    id: data.email,
                    owner_uid: post.owner_uid
                };
                // this was the only way to do it otherwise the useStat wil not be updated when it pass the Params to navigation
                navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated });
            });
            return () => unsubscribe();
        });
    };
    // this does not work currently it has issue with userData and other types of passing the data<<<<<<-(Solved)
    const handlePostNavigationFromHome = (post, theme) => {
        // if the post that is click is users own post then take them to their profile,else navigate to the user.
        if (post.owner_email === firebase.auth().currentUser.email) {
            navigation.navigate("UserProfile");
        } else {
            GetPostOwnerData(post);
        }
    };
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            alignItems: "center",
        }}>

            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} activeOpacity={0.7} onPress={() => handlePostNavigationFromHome(post)}>
                <Image
                    source={{ uri: post.profile_picture, cache: "force-cache" }}
                    style={[styles.userImage, { borderColor: theme.textTertiary }]}
                    placeholder={blurHash}
                    contentFit="cover"
                    transition={50}
                />
                <Text style={{ color: theme.textPrimary, marginLeft: 6, fontWeight: "700" }}>{post.user}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
                <Text style={{ color: theme.textPrimary, fontWeight: "900", marginBottom: 15, marginRight: 10 }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}
//#endregion




//#region Post Image
const PostImage = ({ post, handleLike, theme }) => {
    // when pressed twice then pass post to handleLike(post)
    const [pressCount, setPressCount] = useState(0);
    const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
    const [fadeAnimation] = useState(new Animated.Value(1));
    const [showHeart, setShowHeart] = useState(false);

    const handleDoubleTapImage = (post, event) => {
        const { locationX, locationY } = event.nativeEvent;
        setHeartPosition({ x: locationX, y: locationY });
        setPressCount(pressCount + 1);

        if (pressCount === 1) {
            handleLike(post);
            setShowHeart(true);
            fadeOutHeart();
        }
        setTimeout(() => {
            setPressCount(0);
        }, 300);
    };

    const fadeOutHeart = () => {
        Animated.timing(fadeAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            setShowHeart(false);
            fadeAnimation.setValue(1);
        });
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{ width: '100%', height: 450 }}
            onPress={(event) => handleDoubleTapImage(post, event)}>
            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
            <Image
                source={{ uri: post.imageURL, cache: 'force-cache' }}
                style={{ height: '100%' }}
                placeholder={blurHash}
                contentFit="cover"
                cachePolicy={'memory-disk'}
                transition={50}
            />
            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
            {showHeart && (
                <Animated.View
                    style={{
                        top: heartPosition.y - 12,
                        left: heartPosition.x - 12,
                        opacity: fadeAnimation,
                        position: "absolute"
                    }}>
                    <SvgComponent svgKey="LikeActiveSVG" width={moderateScale(60)} height={moderateScale(60)} fill={theme.textPrimary} />
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};


//#endregion

//#region Post Footer
const PostFooter = ({ toggleContainer, handleLike, post, handleSavedPost, savedPosts, handleSharePostToggle, theme }) => {
    const isPostSaved = savedPosts?.saved_post_id?.includes(post.id) || false;
    const isPostLiked = post?.likes_by_users?.includes(firebase.auth().currentUser.email)
    return (
        <View style={{ flexDirection: "row" }}>
            <View style={styles.leftFooterIconsContainer}>
                <TouchableOpacity onPress={() => handleLike(post)}>
                    <Icon svgKey={isPostLiked ? Icons[0].active : Icons[0].notActive} theme={theme} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleContainer}>
                    <Icon svgKey={Icons[1].name} theme={theme} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSharePostToggle(post)}>
                    <Icon svgKey={Icons[2].name} theme={theme} />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity onPress={() => handleSavedPost(post)}>
                    <Icon svgKey={isPostSaved ? Icons[3].active : Icons[3].notActive} theme={theme} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
//#endregion

//#region Icon Buttons
const Icon = ({ svgKey, theme }) => (
    <SvgComponent svgKey={svgKey} width={moderateScale(24)} height={moderateScale(24)} fill={theme.textPrimary} stroke={theme.textPrimary} />
)
//#endregion

//#region Likes Display
const Likes = ({ post, theme, t }) => (
    <View style={{ flexDirection: "row", marginTop: 4, }}>
        <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>{post.likes_by_users.length.toLocaleString('en')} {t('screens.home.text.like')}</Text>
    </View>
)
//#endregion

//#region Category and Time Display
const CategoryAndTime = ({ post, theme, t }) => (
    <View style={{ flexDirection: "row", marginTop: 5, gap: 10 }}>
        <LinearGradient
            colors={[theme.appGradientPrimary, theme.appGradientSecondary, theme.appGradientTertiary]}
            style={{ minWidth: "20%", maxWidth: "30%", padding: 5, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: theme.Primary === "#050505" ? theme.textPrimary : theme.Primary, fontWeight: "600" }}>{post.category}</Text>
        </LinearGradient>
        <View style={{ height: "100%", width: 1, borderRadius: 50, backgroundColor: theme.textPrimary }}></View>
        <View style={{ width: "20%", padding: 5, justifyContent: "center", alignItems: "flex-start" }}>
            <Text style={{ color: theme.textPrimary, fontWeight: "600" }}>{post.timeOfMake} {t('screens.home.text.CategoryAndTime')}</Text>
        </View>
    </View>
)
//#endregion

//#region Caption Display
const Caption = ({ post, isExpanded, toggleCaption, theme, t }) => (
    <>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ color: theme.textPrimary }} onPress={toggleCaption}>
                <Text style={{ fontWeight: "700" }}>{post.user} </Text>
                {isExpanded ? post.caption : post.caption.slice(0, 100) + '... '}
                <Text style={{ color: theme.textSecondary }}>
                    {isExpanded ? '' : t('screens.home.text.CaptionExpand')}
                </Text>
            </Text>
        </View>
        {isExpanded ? <CaptionIngredient post={post} theme={theme} t={t} /> : null}
        {isExpanded ? <CaptionInstruction post={post} theme={theme} t={t} /> : null}
    </>

)
//#endregion

//#region Caption Ingredient
const CaptionIngredient = ({ post, theme, t }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: theme.textPrimary, marginBottom: 5, marginTop: 10 }}>{t('screens.home.text.Ingredients')}</Text>
        <Text style={{ color: theme.textPrimary }}>
            {(
                post.captionIngredients.map((ingredient, index) => (
                    <Text key={index}>
                        {index + 1}. {ingredient}
                        {"\n"}
                    </Text>
                ))
            )}
        </Text>
    </>
)
//#endregion

//#region Caption Instruction
const CaptionInstruction = ({ post, theme, t }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: theme.textPrimary, marginBottom: 5, marginTop: 0 }}>{t('screens.home.text.Instructions')}</Text>
        <Text style={{ color: theme.textPrimary }}>
            {(
                post.captionInstructions.map((instruction, index) => (
                    <Text key={index}>
                        {index + 1}. {instruction}
                        {"\n"}
                    </Text>
                ))
            )}
        </Text>
    </>
)
//#endregion

//#region CommentSection text count Display
const CommentSection = ({ post, theme, t }) => (
    <View style={{ marginTop: 5 }}>
        {/* If the is no !! tha application will crash over the .length function since it will return a 0 value if it
    does not have any comments and by that the React will not render teh 0 value because it is not wrapped 
    in text component, and to return teh value of true or false from that line condition it must use the "!!" */}
        {!!post.comments.length && (
            <Text style={{ color: theme.textSecondary }}>
                {t('screens.home.text.comments.view')}{post.comments.length > 1 ? ' ' + t('screens.home.text.comments.all') : ''} {post.comments.length}{' '}
                {post.comments.length > 1 ? t('screens.home.text.comments.many') : t('screens.home.text.comments.one')}
            </Text>
        )}
    </View>
)
//#endregion

//#region Comments Modal
const Comments = ({ post, isContainerVisible, setContainerVisible, userData, handleComment, commentText, setCommentText, theme, t }) => {
    const [btnStat, setBtnStat] = useState(false)

    const handleDisableBtn = (value) => {
        if (value.length < 2) {
            setBtnStat(true);
        } else {
            setBtnStat(false);
        }
        setCommentText(value);
    };
    return (
        <Modal
            visible={isContainerVisible}
            animationType="slide"
            transparent={false}
            presentationStyle="pageSheet"
            statusBarTranslucent={false}
            onRequestClose={() => {
                setContainerVisible(!isContainerVisible);
            }}
        >
            <View
                style={{ backgroundColor: theme.SubPrimary, flex: 1 }}
            >

                <CommentsHeader theme={theme} t={t} />
                <CommentsContent post={post} theme={theme} t={t} />

                {/* this cant be refactored due to the data passing issue, the post must be as post=(post) and the userData={userData} handleComment={handleComment}
                and due to this they cant be compound together, it has to stay like this avoiding nesting the prams */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={30}
                >
                    <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", }}>

                        <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 50,
                                margin: 20,
                                marginBottom: 50,
                                borderWidth: 1,
                                borderColor: theme.Secondary
                            }}
                            placeholder={blurHash}
                            contentFit="cover"
                            cachePolicy={"memory-disk"}
                            transition={50}
                        />
                        {/* why on earth this was as ScrollView!!!!!!!!!!! 2 weeks of trying to solve this issue and it was only because there was an extra scrollView */}
                        <View
                            style={[styles.inputControl, { borderColor: theme.dividerPrimary }]}>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={true}
                                autoFocus={true}
                                spellCheck={true}
                                style={[{
                                    flexGrow: 1, flexShrink: 1, color: theme.textPrimary, paddingHorizontal: 16,
                                    paddingTop: Platform.OS === 'ios' ? 15 : 0,
                                    paddingBottom: 15,
                                }]}
                                placeholder={`${t('screens.home.text.comments.placeHolder')} ${post.user} ${t('screens.home.text.comments.placeHolderExtra')}...`}
                                placeholderTextColor={theme.placeholder}
                                value={commentText}
                                textContentType='none'
                                multiline={true}
                                keyboardType='default'
                                onChangeText={value => handleDisableBtn(value)}
                            />

                            <TouchableOpacity disabled={commentText.length < 2} onPress={() => {
                                handleComment(post, commentText);
                                setCommentText("");
                            }} >
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={btnStat ?
                                        [theme.appInactiveGradientPrimary, theme.appInactiveGradientSecondary, theme.appInactiveGradientTertiary]
                                        :
                                        [theme.appGradientPrimary, theme.appGradientSecondary, theme.appGradientTertiary]}
                                    style={{ marginRight: 10, padding: 5, borderRadius: 11, justifyContent: "center", alignItems: "center" }}>
                                    <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={theme.textPrimary} />
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

//#endregion

//#region Comment Data inside Modal
const CommentsContent = ({ post, theme, t }) => {
    return (
        <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={styles.commentsContainer}>
            {post.comments.map((comment, index) => (
                <View key={index} style={{ marginVertical: 15, }} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", }}>
                            <Image
                                source={{ uri: comment.profile_picture, cache: "force-cache" }}
                                style={[styles.userImage, { borderColor: theme.textTertiary }]}
                                placeholder={blurHash}
                                contentFit="cover"
                                cachePolicy={"memory-disk"}
                                transition={50}
                            />

                            <View style={{ flexDirection: "column", width: "80%", flexGrow: 1 }}>
                                <Text style={{ color: theme.textPrimary, marginLeft: 6, fontWeight: "700" }}>{comment.username}</Text>
                                <Text style={{ color: theme.textPrimary, marginLeft: 6, }}>
                                    {comment.comment}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: theme.textSecondary, marginRight: 6, }}> {calculateTimeDifference(comment.createdAt, t)}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}


//#endregion

//#region Comments Header in Modal
const CommentsHeader = ({ theme, t }) => (
    <>
        <View style={[styles.ModalTopNotch, { backgroundColor: theme.notch, }]} />
        <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 20, alignSelf: "center", padding: 20, marginTop: 5 }}>{t('screens.home.text.comments.many')}</Text>
        <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
    </>
)
//#endregion



//#region styles
const styles = StyleSheet.create({
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 50,
        marginLeft: 6,
        borderWidth: 1,
    },
    leftFooterIconsContainer: {
        flexDirection: "row",
        width: "30%",
        justifyContent: "space-between",
    },
    commentsContainer: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 20,
    },
    ModalTopNotch: {
        height: 5,
        width: 40,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        alignSelf: "center"
    },
    inputControl: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        marginTop: 20,
        marginRight: 20,
        marginBottom: 50,
        flex: 1, // Ensure the TextInput expands to fill its container
    },
});

//#endregion
export default Post