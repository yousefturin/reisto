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




import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';

const useFastPosts = (fromWhere = null, QueryParam) => {
    const [userPosts, setUserPost] = useState([])
    const [loading, setLoading] = useState(true);
    // it is false when loading is still not done from the promise if
    //  loading be comes false then it means that the data is fetched and the user has no posts
    const [afterLoading, setAfterLoading] = useState(false);


    useEffect(() => {
        let unsubscribe
        const user = firebase.auth().currentUser.email
        
        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            unsubscribe = fetchUserSavedPosts();
        }
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (unsubscribe) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            }
        };
    }, [])


    const fetchUserSavedPosts = useCallback(async () => {
        const user = firebase.auth().currentUser;
        if (user) {
            if (fromWhere !== null) {
                const cachedData = await AsyncStorage.getItem('userPostURLs');
                if (cachedData) {
                    setLoading(false);
                    setUserPost(JSON.parse(cachedData));
                }
            }
            const query = db.collection('users').doc(QueryParam).collection('posts').orderBy('createdAt', 'desc');
            return query.onSnapshot(snapshot => {
                const postsProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    const dbImageURL = dbPostData.imageURL
                    // Code was improved by removing the mapping userProfile, since it will not be shown in this case.
                    return {
                        id: post.id,
                        imageURL: dbImageURL,
                    }
                })
                Promise.all(postsProfilePictures).then(posts => {
                    setLoading(false);
                    if (posts.length === 0) setAfterLoading(true);
                    setUserPost(posts)
                    if (fromWhere !== null) AsyncStorage.setItem('userPostURLs', JSON.stringify(posts))
                }).catch(error => {
                    console.error("Error fetching Promise posts:", error);
                })
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            });
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    }, [fromWhere, QueryParam]);

    return { userPosts, loading, afterLoading, fetchUserSavedPosts }
}

export default useFastPosts