import { Dimensions, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize';
import { db, firebase } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';


const { moderateScale } = initializeScalingUtils(Dimensions);
const windowHeight = Dimensions.get('window').height;

const UserProfilePostScreen = ({ route }) => {
    const { userData, scrollToPostId } = route.params;
    const [posts, setPost] = useState([])
    const flatListRef = useRef();
    const [initialScrollIndex, setInitialScrollIndex] = useState(null);
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);

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
        let unsubscribe;
        const fetchUserPosts = () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const query = db.collection('users').doc(user.email).collection('posts').orderBy('createdAt', 'desc');
                unsubscribe = query.onSnapshot(snapshot => {
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
                return () => { };
            }
        };
        fetchUserPosts()
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            
            const querySnapshot = await db.collection('users').doc(firebase.auth().currentUser.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = [];
                const fetchPromisesSecond = [];

                for (const follower of data.followers) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];
                const uniqueUserIds = new Set();
                const filteredUsersData = allUsersData.filter(user => {
                    if (uniqueUserIds.has(user.owner_uid)) {
                        return false;
                    } else {
                        uniqueUserIds.add(user.owner_uid);
                        return true;
                    }
                });

                setUsersForSharePosts(filteredUsersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    const renderItem = ({ item }) => (
        <Post post={item} userData={userData}  usersForSharePosts={usersForSharePosts}/>
    )


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <OwnerProfileHeader userData={userData} />
            {posts.length !== 0 ? (
                <FlatList
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialScrollIndex={initialScrollIndex}
                    // this is a trick to allow the user to scroll, it needs more test to see if those values will work on
                    // different devices the same way to remove the drop fame.
                    getItemLayout={(data, index) => ({ length: windowHeight * 0.736, offset: windowHeight * 0.736 * index, index })}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                />
            ) : (
                <LoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}
const OwnerProfileHeader = ({ userData }) => {
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
                <Text style={{ color: "#8E8E93", fontWeight: "600", fontSize: 12 }}>{userData.username.toUpperCase()}</Text>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 20, }}>Posts</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default UserProfilePostScreen
