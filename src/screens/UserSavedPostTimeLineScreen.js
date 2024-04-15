import { Dimensions, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
const windowHeight = Dimensions.get('window').height;

const UserSavedPostTimeLineScreen = ({ route }) => {
    const { userData, scrollToPostId } = route.params;
    const [posts, setSavedPosts] = useState([])
    const flatListRef = useRef();
    const [initialScrollIndex, setInitialScrollIndex] = useState(null);

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
        fetchUserSavedPosts();
    }, [])


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
        }
    };
    


    const renderItem = ({ item }) => (
        <Post post={item} userData={userData} />
    )


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <SavedPostsHeader userData={userData} />
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
        </SafeAreaView>
    )
}

export default UserSavedPostTimeLineScreen
