import { SafeAreaView, RefreshControl, FlatList, View, Text } from 'react-native'
import React, { useEffect, useState, useCallback, useContext, useLayoutEffect } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase'
import { UserContext } from '../context/UserDataProvider'
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder'


const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([])
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);
    const userData = useContext(UserContext);

    useEffect(() => {
        // Call fetchPost when the component mounts
        const unsubscribe = fetchPost();
        console.log("Subscribed to posts.");
        // Return a cleanup function to unsubscribe when the component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
                console.log("Unsubscribed from posts.");
            }
        };
    }, []);

    const fetchPost = useCallback(() => {
        const user = firebase.auth().currentUser;
        // Assign the listener and store the reference
        if (user) {
            return db.collectionGroup('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                const postsWithProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    try {
                        const userDoc = await db.collection('users').doc(dbPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbProfilePicture,
                            ...dbPostData
                        }
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        return {
                            id: post.id,
                            ...dbPostData // Fallback to original post data if user document fetch fails
                        }
                    }
                })
                Promise.all(postsWithProfilePictures).then(posts => {
                    setPosts(posts)
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            });
        } else {
            console.error("No authenticated user found.");
            return null; // Return null if user is not authenticated
        }
    }, []);
    // this function need a fix for cleanup after mount
    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            // Fetch posts again
            const unsubscribe = fetchPost();
            console.log("Refreshing posts...");
            // Return a cleanup function to unsubscribe when the fetch is done
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                    console.log("Unsubscribed from posts after refreshing.");
                }
            };
        } catch (error) {
            console.error('Error refreshing posts:', error);
            return () => { };
        } finally {
            setRefreshing(false);
        }
    }, [fetchPost]);

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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <Header />
            {posts.length !== 0 ? (
                <FlatList
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps='handled'
                    data={posts}
                    renderItem={({ item, index }) => (
                        <Post post={item} key={index} isLastPost={index === posts.length - 1} userData={userData} usersForSharePosts={usersForSharePosts} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    initialNumToRender={2}
                    maxToRenderPerBatch={1}
                    updateCellsBatchingPeriod={100}
                    windowSize={7}
                />
            ) : (
                <LoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}


export default HomeScreen