import { ScrollView, RefreshControl, SafeAreaView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserDataProvider';
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';
import { colorPalette } from '../Config/Theme';

const UserSavedPostScreen = () => {
    const userData = useContext(UserContext);
    const [savedPosts, setSavedPosts] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const unsubscribe = fetchUserSavedPosts();

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    // fetching here is different from UserSavedPostTimeLineScreen because it does not need the profile image to be displayed.
    // the fetching might be change for better and faster process<<<<<<<<<<<-.
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
                            setSavedPosts(savedPostsData);
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            fetchUserSavedPosts(); // Your function to fetch posts
        } catch (error) {
            console.error('Error refreshing posts:', error);
        }
        setRefreshing(false);
    }, []);

    const handlePostPress = (postId) => {
        setScrollToPostId(postId)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.dark.Primary  }}>
            <>
                <SavedPostsHeader header={"Saved Posts"} />
                <ScrollView
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {savedPosts.length !== 0 || savedPosts.id?.length !== 0 ? (
                        <SavedPostsGrid posts={savedPosts} userData={userData} onPostPress={handlePostPress} navigateToScreen={"SavedPosts"} />
                    ) : (
                        <LoadingPlaceHolder />
                    )}
                </ScrollView>
            </>

        </SafeAreaView>
    )
}


export default UserSavedPostScreen