/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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
