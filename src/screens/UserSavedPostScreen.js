import { ScrollView, RefreshControl, SafeAreaView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserDataProvider';
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';

const UserSavedPostScreen = () => {
    const userData = useContext(UserContext);
    const [posts, setSavedPosts] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUserSavedPosts();
    }, [])

    // fetching here is different from UserSavedPostTimeLineScreen because it does not need the profile image to be displayed.
    // the fetching might be change for better and faster process<<<<<<<<<<<-.
    const fetchUserSavedPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            // bring all posts from across users
            db.collectionGroup('posts').onSnapshot(querySnapshot => {
                // create an array and push all the post inside of it that will be used later for matching saved posts with posts that are fetched 
                const allPosts = [];
                querySnapshot.forEach(doc => {
                    allPosts.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // fetch user saved posts collection and bring the data 
                db.collection('users').doc(user.email).collection('saved_post').get().then(snapshot => {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <>
                <SavedPostsHeader />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <SavedPostsGrid posts={posts} userData={userData} onPostPress={handlePostPress} navigateToScreen={"SavedPosts"} />
                </ScrollView>
            </>

        </SafeAreaView>
    )
}


export default UserSavedPostScreen