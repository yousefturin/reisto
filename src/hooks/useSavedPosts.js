import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';


// get the user saved post full data and profile picture that will be displayed in the UserSavedPostTimeLineScreen
const useSavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const subscription = fetchUserSavedPosts();

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, [])

    const fetchUserSavedPosts = useCallback(async () => {
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
                                setLoading(false);
                                setSavedPosts(posts);
                            }).catch(error => {
                                console.error('Error fetching saved posts with profile pictures:', error);
                            });
                        } else {
                            console.error('Invalid or empty post IDs array');
                            setLoading(null);
                            return
                        }
                    } else {
                        console.log('No saved post document found for the user');
                        setLoading(null);
                        return
                    }
                }).catch(error => {
                    console.error("Error fetching saved posts:", error);
                });
            }, error => {
                return () => { };
            })
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    }, []);

    return { savedPosts, loading }
}

export default useSavedPosts