import { db } from "../firebase";
import { useCallback, useEffect, useState } from 'react';

const useFastSearchPosts = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const subscription = fetchPost();

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
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
                setLoading(false)
                setPosts(posts)
            }).catch(error => {
                console.error("Error fetching Promise posts:", error);
            })
        }, error => {
            return () => { };
        });
    }, []);

    return { posts, loading, fetchPost }
}

export default useFastSearchPosts