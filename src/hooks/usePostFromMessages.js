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