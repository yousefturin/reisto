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
} from 'react-native'
import React, { useEffect, useState } from 'react'
import SvgComponent from "../../utils/SvgComponents";
import initializeScalingUtils from "../../utils/NormalizeSize"
import { Divider } from 'react-native-elements';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculator';
import { LinearGradient } from 'expo-linear-gradient';
import { firebase, db } from '../../firebase'
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';


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
const Post = ({ post, userData, isLastPost }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isContainerVisible, setContainerVisible] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [savedPosts, setSavedPosts] = useState([])
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
    return (
        <View style={{ paddingBottom: isLastPost ? 55 : 30 }}>
            {/* <Divider width={1} orientation='horizontal' color="#222222" /> */}
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                <PostFooter toggleContainer={toggleContainer} post={post} handleLike={handleLike} handleSavedPost={handleSavedPost} savedPosts={savedPosts} />
                <Likes post={post} />
                <CategoryAndTime post={post} />
                <Caption post={post} isExpanded={isExpanded} toggleCaption={toggleCaption} />
                {!!post.comments.length ?
                    <TouchableOpacity onPress={toggleContainer}>
                        <CommentSection post={post} />
                    </TouchableOpacity> : null
                }

                <Comments post={post} setContainerVisible={setContainerVisible} handleComment={handleComment} setCommentText={setCommentText} commentText={commentText} isContainerVisible={isContainerVisible} userData={userData} />
                <TimeStamp post={post} />
            </View>
        </View>
    )
}
//#endregion

const TimeStamp = ({ post }) => (
    post.createdAt && (
        <View style={{ marginTop: 5 }}>
            <Text style={{ color: "#8E8E93" }}>
                {calculateTimeDifference(post.createdAt)} ago
                {/* {console.log(post.createdAt)} */}
            </Text>
        </View>
    )
)


//#region Post Header
const PostHeader = ({ post }) => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            alignItems: "center",
        }}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                    source={{ uri: post.profile_picture, cache: "force-cache" }}
                    style={styles.userImage}
                    placeholder={blurHash}
                    contentFit="cover"
                />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>{post.user}</Text>
            </View>
            <TouchableOpacity>
                <Text style={{ color: "#fff", fontWeight: "900", marginBottom: 15, marginRight: 10 }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}
//#endregion

//#region Post Image
const PostImage = ({ post }) => {
    return (
        <View style={{ width: "100%", height: 450, }}>
            <Image
                source={{ uri: post.imageURL, cache: "force-cache" }}
                style={{ height: "100%"}}
                placeholder={blurHash}
                contentFit="cover"
                cachePolicy={"memory-disk"}
            />
        </View>
    )
}


//#endregion

//#region Post Footer
const PostFooter = ({ toggleContainer, handleLike, post, handleSavedPost, savedPosts }) => {
    const isPostSaved = savedPosts?.saved_post_id?.includes(post.id) || false;
    const isPostLiked = post?.likes_by_users?.includes(firebase.auth().currentUser.email)
    return (
        <View style={{ flexDirection: "row" }}>
            <View style={styles.leftFooterIconsContainer}>
                <TouchableOpacity onPress={() => handleLike(post)}>
                    <Icon svgKey={isPostLiked ? Icons[0].active : Icons[0].notActive} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleContainer}>
                    <Icon svgKey={Icons[1].name} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon svgKey={Icons[2].name} />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity onPress={() => handleSavedPost(post)}>
                    <Icon svgKey={isPostSaved ? Icons[3].active : Icons[3].notActive} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
//#endregion

//#region Icon Buttons
const Icon = ({ svgKey }) => (
    <SvgComponent svgKey={svgKey} width={moderateScale(24)} height={moderateScale(24)} fill={'#ffffff'} />
)
//#endregion

//#region Likes Display
const Likes = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 4, }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{post.likes_by_users.length.toLocaleString('en')} Likes</Text>
    </View>
)
//#endregion

//#region Category and Time Display
const CategoryAndTime = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 5, gap: 10 }}>
        <LinearGradient
            colors={['#7e9bdf', '#6581B7', '#445379']}
            style={{ minWidth: "20%", maxWidth: "30%", padding: 5, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{post.category}</Text>
        </LinearGradient>
        <View style={{ height: "100%", width: 1, borderRadius: 50, backgroundColor: "#fff" }}></View>
        <View style={{ width: "20%", padding: 5, justifyContent: "center", alignItems: "flex-start" }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{post.timeOfMake} min</Text>
        </View>
    </View>
)
//#endregion

//#region Caption Display
const Caption = ({ post, isExpanded, toggleCaption }) => (
    <>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ color: "#fff" }} onPress={toggleCaption}>
                <Text style={{ fontWeight: "700" }}>{post.user} </Text>
                {isExpanded ? post.caption : post.caption.slice(0, 100) + '... '}
                <Text style={{ color: "#8E8E93" }}>
                    {isExpanded ? '' : 'more'}
                </Text>
            </Text>
        </View>
        {isExpanded ? <CaptionIngredient post={post} /> : null}
        {isExpanded ? <CaptionInstruction post={post} /> : null}
    </>

)
//#endregion

//#region Caption Ingredient
const CaptionIngredient = ({ post }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff", marginBottom: 5, marginTop: 10 }}>Ingredients</Text>
        <Text style={{ color: "#fff" }}>
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
const CaptionInstruction = ({ post }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff", marginBottom: 5, marginTop: 0 }}>Instructions</Text>
        <Text style={{ color: "#fff" }}>
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
const CommentSection = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        {/* If the is no !! tha application will crash over the .length function since it will return a 0 value if it
    does not have any comments and by that the React will not render teh 0 value because it is not wrapped 
    in text component, and to return teh value of true or false from that line condition it must use the "!!" */}
        {!!post.comments.length && (
            <Text style={{ color: "#8E8E93" }}>
                View{post.comments.length > 1 ? ' all' : ''} {post.comments.length}{' '}
                {post.comments.length > 1 ? 'comments' : 'comment'}
            </Text>
        )}
    </View>
)
//#endregion

//#region Comments Modal
const Comments = ({ post, isContainerVisible, setContainerVisible, userData, handleComment, commentText, setCommentText }) => {
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
                style={{ backgroundColor: "#262626", flex: 1 }}
            >

                <CommentsHeader />
                <CommentsContent post={post} />

                {/* this cant be refactored due to the data passing issue, the post must be as post=(post) and the userData={userData} handleComment={handleComment}
                and due to this they cant be compound together, it has to stay like this avoiding nesting the prams */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={30}
                >
                    <Divider width={1} orientation='horizontal' color="#383838" />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", }}>

                        <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 50,
                                margin: 20,
                                marginBottom: 50,
                                borderWidth: 1,
                                borderColor: "#2b2b2b"
                            }}
                            placeholder={blurHash}
                            contentFit="cover"
                            cachePolicy={"memory-disk"}
                        />

                        <ScrollView
                            keyboardShouldPersistTaps="always"
                            contentContainerStyle={styles.inputControl}>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={true}
                                autoFocus={true}
                                spellCheck={true}
                                style={[{
                                    flexGrow: 1, flexShrink: 1, color: "#ffffff", paddingHorizontal: 16,
                                    paddingTop: Platform.OS === 'ios' ? 15 : 0,
                                    paddingBottom: 15,
                                }]}
                                placeholder={`Add a Comment for ${post.user}...`}
                                placeholderTextColor={"#383838"}
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
                                    colors={btnStat ? ['#bebebe', '#727272', '#4c4c4c'] : ['#7e9bdf', '#6581B7', '#445379']}
                                    style={{ marginRight: 10, padding: 5, borderRadius: 11, justifyContent: "center", alignItems: "center" }}>
                                    <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={'#ffffff'} />
                                </LinearGradient>

                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

//#endregion

//#region Comment Data inside Modal
const CommentsContent = ({ post }) => {
    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.commentsContainer}>
            {post.comments.map((comment, index) => (
                <View key={index} style={{ marginVertical: 15, }} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", }}>
                            <Image
                                source={{ uri: comment.profile_picture, cache: "force-cache" }}
                                style={styles.userImage}
                                placeholder={blurHash}
                                contentFit="cover"
                                cachePolicy={"memory-disk"}/>

                            <View style={{ flexDirection: "column", width: "80%", flexGrow: 1 }}>
                                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>{comment.username}</Text>
                                <Text style={{ color: "#ffffff", marginLeft: 6, }}>
                                    {comment.comment}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: "#979797", marginRight: 6, }}> {calculateTimeDifference(comment.createdAt)}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}


//#endregion

//#region Comments Header in Modal
const CommentsHeader = ({ }) => (
    <>
        <View style={styles.ModalTopNotch} />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20, alignSelf: "center", padding: 20, marginTop: 5 }}>Comments</Text>
        <Divider width={1} orientation='horizontal' color="#383838" />
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
        borderColor: "#2b2b2b"
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
        // justifyContent: "flex-start",
        // alignItems: "flex-start",
    },
    ModalTopNotch: {
        height: 5,
        width: 40,
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        backgroundColor: "#2b2b2b",
        alignSelf: "center"
    },
    inputControl: {
        borderColor: "#383838",
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