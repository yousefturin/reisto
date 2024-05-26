import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';

const usePostFromMessages = (searchQuery = null, QueryParam = null) => {
    const [post, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscription = fetchThePost();
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        };
    }, [searchQuery, QueryParam]);

    const fetchThePost = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
            const query = db.collection('users').doc(searchQuery)
                .collection('posts').doc(QueryParam)

            return query.onSnapshot(async snapshot => {
                const dbUserPostData = snapshot.data();
                if (!dbUserPostData) {
                    setLoading(null);
                    return () => { };
                } else {
                    try {
                        const userDoc = await db.collection('users').doc(dbUserPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbUserProfilePicture = dbUserData.profile_picture
                        const postWithProfilePicture = {
                            id: snapshot.id,
                            profile_picture: dbUserProfilePicture,
                            ...dbUserPostData
                        };
                        setPosts(postWithProfilePicture);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        setLoading(null);
                        setPosts({
                            id: snapshot.id,
                            ...dbUserPostData
                        });

                    }
                }
            }, error => {
                return () => { };
            })
        }
        else {
            console.error("No authenticated user found.");
            setLoading(null);
            return () => { };
        }
    }


    return { post, loading }
}

export default usePostFromMessages