import { Dimensions, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
const windowHeight = Dimensions.get('window').height;

const UserSavedPostTimeLineScreen = ({ route }) => {
    const { userData, scrollToPostId } = route.params;
    const [savedPosts, setSavedPosts] = useState([])
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
        if (scrollToPostId && savedPosts.length > 0) {
            const index = savedPosts.findIndex(post => post.id === scrollToPostId);
            if (index !== -1) {
                setInitialScrollIndex(index);
                if (flatListRef.current) {
                    // Scroll to the initial index
                    flatListRef.current.scrollToIndex({ animated: true, index });
                }
            }
        }
    }, [savedPosts, scrollToPostId]);

    useEffect(() => {
        let unsubscribe;

        const fetchUserSavedPosts = () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const queryPost = db.collectionGroup('posts')
                const querySavedPost = db.collection('users').doc(user.email).collection('saved_post')
                // bring all posts from across users
                return queryPost.onSnapshot(querySnapshot => {
                    // create an array and push all the post inside of it that will be used later for matching saved posts with posts that are fetched 
                    const allPosts = [];
                    querySnapshot.forEach(doc => {
                        allPosts.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    // fetch user saved posts collection and bring the data 
                    querySavedPost.get().then(snapshot => {
                        const savedPostDoc = snapshot.docs[0];
                        // if the data exist 
                        if (savedPostDoc) {
                            // get the ids array from the data 
                            const postIds = savedPostDoc.data().saved_post_id;
                            // if the array data and it is an array 
                            if (postIds && Array.isArray(postIds)) {
                                // filter from the posts array the once that has the same stored id 
                                const savedPostsData = allPosts.filter(post => postIds.includes(post.id));

                                // Fetch profile pictures for the saved posts
                                const postsWithProfilePictures = savedPostsData.map(async post => {
                                    const dbPostData = post;
                                    try {
                                        const userDoc = await db.collection('users').doc(post.owner_email).get()
                                        const dbUserData = userDoc.data()
                                        const dbProfilePicture = dbUserData.profile_picture
                                        return {
                                            ...dbPostData,
                                            profile_picture: dbProfilePicture
                                        }
                                    } catch (error) {
                                        console.error('Error fetching user document:', error)
                                        // If fetching profile picture fails, continue with the post data without it
                                        return dbPostData;
                                    }
                                });

                                Promise.all(postsWithProfilePictures).then(posts => {
                                    setSavedPosts(posts);
                                }).catch(error => {
                                    console.error('Error fetching saved posts with profile pictures:', error);
                                });
                            } else {
                                console.error('Invalid or empty post IDs array');
                            }
                        } else {
                            console.log('No saved post document found for the user');
                        }
                    }).catch(error => {
                        console.error("Error fetching saved posts:", error);
                    });
                })
            } else {
                console.error("No authenticated user found.");
                return () => { };
            }
        };
        fetchUserSavedPosts();
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);

    useLayoutEffect(() => {
        fetchData();
    }, []);
    // if this function is not duplicated across the app, and instead placed in Post Component it will slow down the performance, since it will 
    // be called for each post, and it will be called for each post that is rendered on the screen, but using it in each parent component is better.
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
        <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} />
    )


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <SavedPostsHeader header={"All Posts"} />
            {savedPosts.length !== 0 ? (
                <FlatList
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={savedPosts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialScrollIndex={initialScrollIndex}
                    // this is a trick to allow the user to scroll, it needs more test to see if those values will work on
                    // different devices the same way to remove the drop fame.
                    getItemLayout={(data, index) => ({ length: windowHeight * 0.73, offset: windowHeight * 0.736 * index, index })}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                />
            ) : (
                <LoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}

export default UserSavedPostTimeLineScreen
