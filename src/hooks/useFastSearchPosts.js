import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';

const useFastSearchPosts = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let unsubscribe
        const user = firebase.auth().currentUser.email

        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            unsubscribe = fetchPost();
        }

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (unsubscribe) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            } 
        };
    }, [])

    const fetchPost = useCallback(async () => {
        const query = db.collectionGroup('posts').orderBy('createdAt', 'desc');
        // get the id of each post, and destructure the posts then order them based on createdAt as desc
        return query.onSnapshot(snapshot => {
            const postsWithProfilePictures = snapshot.docs.map(async post => {
                const dbPostData = post.data();
                const dbImageURL = dbPostData.imageURL
                if (dbPostData.length === 0) { setLoading(null); }
                // why tf i was fetching the user data and map the profile image! OMG!, only images are displayed of [posts]
                return {
                    id: post.id,
                    imageURL: dbImageURL,
                }
            })
            Promise.all(postsWithProfilePictures).then(posts => {
                if(postsWithProfilePictures.length === 0) {
                    setLoading(null)
                }else{
                    setLoading(false)
                    setPosts(posts)
                }
            }).catch(error => {
                console.error("Error fetching Promise posts:", error);
                setLoading(null)
            })
        }, error => {
            console.error("Error listening to document:", error);
            setLoading(null)
            return () => { };
        });
    }, []);

    return { posts, loading, fetchPost }
}

export default useFastSearchPosts