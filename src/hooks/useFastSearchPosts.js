/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




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
                    // Code was improved by removing the mapping userProfile, since it will not be shown in this case.
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