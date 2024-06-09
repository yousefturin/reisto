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




import { useState, useEffect, useCallback } from 'react';
import { db, firebase } from '../firebase';

const useShare = (fromWhere = null, ParamCondition = null) => {
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const user = firebase.auth().currentUser.email
        
        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            fetchData();
        }


    }, [fetchData]);

    const fetchData = useCallback(async () => {
        try {
            const querySnapshot = await db.collection('users')
                .doc(firebase.auth().currentUser.email)
                .collection('following_followers')
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = data.followers.map(follower => db.collection('users').doc(follower).get());
                const fetchPromisesSecond = data.following.map(following => db.collection('users').doc(following).get());

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];
                const uniqueUserIds = new Set();
                let filteredUsersData
                // excluding the current user from the list for the messages.
                if (fromWhere === "NewMessageToFollowAndFollowers") {
                    filteredUsersData = allUsersData.filter(user => {
                        if (uniqueUserIds.has(user.owner_uid) || ParamCondition.includes(user.email)) {
                            return false;
                        } else {
                            uniqueUserIds.add(user.owner_uid);
                            return true;
                        }
                    });
                } else {
                    filteredUsersData = allUsersData.filter(user => {
                        if (uniqueUserIds.has(user.owner_uid)) {
                            return false;
                        } else {
                            uniqueUserIds.add(user.owner_uid);
                            return true;
                        }
                    });
                }

                if (filteredUsersData.length === 0) {
                    setLoading(null);
                } else {
                    setLoading(false);
                    setFollowingUsers(followingData);
                    setUsersForSharePosts(filteredUsersData);
                }
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data from Share:", error);
        }
    }, [fromWhere, ParamCondition]);


    return { usersForSharePosts, followingUsers, loading };
}

export default useShare
