/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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