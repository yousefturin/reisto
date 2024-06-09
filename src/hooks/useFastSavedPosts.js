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

const useFastSavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([])
    const [loading, setLoading] = useState(true);
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
            const cachedData = await AsyncStorage.getItem('userSavedPostURLs');
            if (cachedData) {
                setLoading(false);
                setSavedPosts(JSON.parse(cachedData));
            }
            const queryPost = db.collectionGroup('posts')
            const querySavedPost = db.collection('users').doc(user.email).collection('saved_post')
            // bring all posts from across users
            return queryPost.onSnapshot(querySnapshot => {
                // create an array and push all the post inside of it that will be used later for matching saved posts with posts that are fetched 
                const allPosts = [];
                querySnapshot.forEach(doc => {
                    const dbPostData = doc.data();
                    const dbImageURL = dbPostData.imageURL
                    allPosts.push({
                        id: doc.id,
                        imageURL: dbImageURL,
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
                            setLoading(false);
                            if (savedPostsData.length === 0) setAfterLoading(true);

                            setSavedPosts(savedPostsData);
                            AsyncStorage.setItem('userSavedPostURLs', JSON.stringify(savedPostsData));
                        } else {
                            console.error('Invalid or empty post IDs array');
                        }
                    } else {
                        console.log('No saved post document found for the user');
                    }
                }).catch(error => {
                    console.error("Error fetching saved posts:", error);
                });
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            })
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    }, []);

    return {savedPosts, loading, afterLoading}
}

export default useFastSavedPosts