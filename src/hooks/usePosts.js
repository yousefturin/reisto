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

const usePosts = (fromWhere, searchQuery = null, QueryParam = null, shouldFetch = true) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shouldFetch) return;
        let unsubscribe;
        if (fromWhere === "Search" || fromWhere === "Home") {
            unsubscribe = fetchSearchPost();
        } else if (fromWhere === "AdditionalSearchScreen") {
            unsubscribe = fetchCustomPost(searchQuery);
        } else if (fromWhere === "UserProfilePostScreen" || fromWhere === "OthersProfilePostScreen") {
            unsubscribe = fetchUserPosts();
        } else if (fromWhere === "MessagesToSharedPost") {
            unsubscribe = fetchThePost();
        }
        return () => {
            // Check if subscription object contains an unsubscribe function
            if (unsubscribe) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            }
        };
    }, []);

    const fetchPosts = useCallback(async (query) => {
        const user = firebase.auth().currentUser;
        if (user) {
            return query.onSnapshot(snapshot => {
                const postsWithProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    if (dbPostData.length === 0) { setLoading(null); return }
                    try {
                        const userDoc = await db.collection('users').doc(dbPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbProfilePicture, 
                            ...dbPostData
                        }
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        return {
                            id: post.id,
                            ...dbPostData // Fallback to original post data if user document fetch fails
                        }
                    }
                })
                Promise.all(postsWithProfilePictures).then(posts => {
                    if (postsWithProfilePictures.length === 0) {
                        setLoading(null);
                    } else {
                        // removed the flicker of being loading false but the data is about to be set
                        setPosts(posts)
                        setLoading(false);
                    }
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                    setLoading(null);
                })
            }, error => {
                console.error("Error listening to document:", error);
                setLoading(null);
                return () => { };
            });
        } else {
            console.error("No authenticated user found.");
            setLoading(null);
            return () => { };
        }
    }, []);

    const fetchSearchPost = () => {
        const query = db.collectionGroup('posts').orderBy('createdAt', 'desc');
        fetchPosts(query);
    };

    const fetchCustomPost = async (searchQuery) => {
        const query = db.collectionGroup('posts').where('category', '>=', searchQuery).where('category', '<=', searchQuery+"\uf8ff");
        fetchPosts(query);
    };
    const fetchUserPosts = async () => {
        const query = db.collection('users').doc(QueryParam).collection('posts').orderBy('createdAt', 'desc');
        fetchPosts(query);
    }
    const fetchThePost = async () => {
        const query = db.collection('users').doc(QueryParam).collection('posts').doc(searchQuery);
        fetchPosts(query);
    }

    return { posts, loading, fetchPosts: fetchSearchPost };
};

export default usePosts;
