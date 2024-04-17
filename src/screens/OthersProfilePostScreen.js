import { Dimensions, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize';
import { db, firebase } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from '../context/UserDataProvider';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';

const { moderateScale } = initializeScalingUtils(Dimensions);
const windowHeight = Dimensions.get('window').height;

const OthersProfilePostScreen = ({ route }) => {
    const { userDataToBeNavigated, scrollToPostId } = route.params;
    const [posts, setPost] = useState([])
    const flatListRef = useRef();
    const [initialScrollIndex, setInitialScrollIndex] = useState(null);
    const userData = useContext(UserContext);

    const handleScrollToIndexFailed = info => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
    };


    useEffect(() => {
        // Calculate initialScrollIndex only when posts are fetched
        if (scrollToPostId && posts.length > 0) {
            const index = posts.findIndex(post => post.id === scrollToPostId);
            if (index !== -1) {
                setInitialScrollIndex(index);
                if (flatListRef.current) {
                    // Scroll to the initial index
                    flatListRef.current.scrollToIndex({ animated: true, index });
                }
            }
        }
    }, [posts, scrollToPostId]);

    useEffect(() => {
        fetchUserPosts();
    }, [])
    const fetchUserPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            db.collection('users').doc(userDataToBeNavigated.id).collection('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                const userPostsWithProfilePicture = snapshot.docs.map(async post => {
                    const dbUserPostData = post.data();
                    try {
                        const userDoc = await db.collection('users').doc(dbUserPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbUserProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbUserProfilePicture,
                            ...dbUserPostData
                        }
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        return {
                            id: post.id,
                            ...dbUserPostData
                        }
                    }
                })
                Promise.all(userPostsWithProfilePicture).then(posts => {
                    setPost(posts)
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            }, error => {
                console.error("Error fetching posts:", error);
            });
        }
        else {
            console.error("No authenticated user found.");
        }
    };
    const renderItem = ({ item }) => (
        <Post post={item} userData={userData} />
    )


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <OwnerProfileHeader userDataToBeNavigated={userDataToBeNavigated} />
            {posts.length !== 0 ? (
                <FlatList
                    ref={flatListRef}
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialScrollIndex={initialScrollIndex}
                    // this is a trick to allow the user to scroll, it needs more test to see if those values will work on
                    // different devices the same way to remove the drop fame.
                    getItemLayout={(data, index) => ({ length: windowHeight * 0.756, offset: windowHeight * 0.756 * index, index })}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                />
            ) : (
                <LoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}
const OwnerProfileHeader = ({ userDataToBeNavigated }) => {
    const navigation = useNavigation();
    const handlePressBack = () => {
        navigation.goBack()
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#8E8E93", fontWeight: "600", fontSize: 12 }}>{userDataToBeNavigated.username.toUpperCase()}</Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 20, }}>Posts</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default OthersProfilePostScreen