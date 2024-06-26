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
import { useEffect, useState } from 'react';

const useFollowing = (QueryParam) => {
    const [followersAndFollowing, setFollowersAndFollowing] = useState([]);
    const [followersAndFollowingForPassedUser, setFollowersAndFollowingForPassedUser] = useState({ id: "", followers: "", following: "", });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let unsubscribeCurrentUser, unsubscribePassedUser;

        const getFollowersAndFollowingData = async () => {
            try {
                const currentUserEmail = firebase.auth().currentUser.email;
                const passedUserId = QueryParam;

                const [currentUserSnapshot, passedUserSnapshot] = await Promise.all([
                    db.collection('users')
                        .doc(currentUserEmail)
                        .collection('following_followers')
                        .limit(1)
                        .get(),
                    db.collection('users')
                        .doc(passedUserId)
                        .collection('following_followers')
                        .limit(1)
                        .get()
                ]);

                if (!currentUserSnapshot.empty) {
                    const currentUserDoc = currentUserSnapshot.docs[0];
                    const currentUserDocRef = currentUserDoc.ref;

                    unsubscribeCurrentUser = currentUserDocRef.onSnapshot((snapshot) => {
                        const data = snapshot.data();
                        setFollowersAndFollowing({
                            id: snapshot.id,
                            followers: data.followers,
                            following: data.following,
                        });
                        setLoading(false)
                    }, (error) => {
                        console.error("Error listening to current user's document:", error);
                        return () => { };
                    });
                } else {
                    console.log("No document found in the current user's collection.");
                    db.collection('users').doc(currentUserEmail)
                        .collection('following_followers').add({
                            following: [],
                            followers: [],
                            owner_email: currentUserEmail
                        })
                    setFollowersAndFollowing({
                        id: 0,
                        followers: [0],
                        following: [0],
                    });
                    setLoading(false)
                }

                if (!passedUserSnapshot.empty) {
                    const passedUserDoc = passedUserSnapshot.docs[0];
                    const passedUserDocRef = passedUserDoc.ref;

                    unsubscribePassedUser = passedUserDocRef.onSnapshot((snapshot) => {
                        const data = snapshot.data();
                        setFollowersAndFollowingForPassedUser({
                            id: snapshot.id,
                            followers: data.followers,
                            following: data.following,
                        });
                    }, (error) => {
                        setLoading(null)
                        console.error("Error listening to passed user's document:", error);
                        return () => { };
                    });
                } else {
                    console.log("No document found in the passed user's collection.");
                    db.collection('users').doc(passedUserId)
                        .collection('following_followers').add({
                            following: [],
                            followers: [],
                            owner_email: passedUserId
                        })
                    setFollowersAndFollowingForPassedUser({
                        id: 0,
                        followers: [0],
                        following: [0],
                    });
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(null)
                // Handle the error based on the type of error (network issue, permission issue, etc.)
                if (error.code === 'unavailable') {
                    console.error("Firestore service is currently unavailable.");
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            }
        };

        const user = firebase.auth().currentUser.email

        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            getFollowersAndFollowingData();
        }


        return () => {
            // Unsubscribe when component unmounts
            unsubscribeCurrentUser && unsubscribeCurrentUser();
            unsubscribePassedUser && unsubscribePassedUser();
        };
    }, [QueryParam]);

    return { followersAndFollowing, followersAndFollowingForPassedUser, loading };
}

export default useFollowing