/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';

const useCurrentUserFollowing = (QueryParam) => {
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [followersAndFollowing, setFollowersAndFollowing] = useState({ followers: '', following: '', id: '' })

    useEffect(() => {
        const unsubscribe = fetchDataFollowingAndFollowersList();
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (unsubscribe ) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            }

        };
    }, [fetchDataFollowingAndFollowersList])

    useEffect(() => {
        let unsubscribe

        const user = firebase.auth().currentUser.email
        
        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            unsubscribe = fetchData();
        }

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (unsubscribe) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            }
        };
    }, [])

    const fetchDataFollowingAndFollowersList = useCallback(async () => {
        try {
            const querySnapshot = await db.collection('users').doc(QueryParam).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                // Initialize an array to store batched fetch promises
                const fetchPromises = [];
                const fetchPromisesSecond = [];

                // Push fetch promises for each follower <- Needs to fix the issue, what to show for users is it followers or following or both?
                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromises.push(fetchPromise);
                }
                for (const followers of data.followers) {
                    const fetchPromise = db.collection('users').doc(followers).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                // Execute batched reads
                const [followingDocs, followerDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                // Extract data from follower documents
                const followersData = followerDocs
                    .filter(doc => doc.exists)
                    .map(doc => doc.data());
                const followingData = followingDocs
                    .filter(doc => doc.exists)
                    .map(doc => doc.data());

                setFollowersData(followersData);
                setFollowingData(followingData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data from Current Following:", error);
        }
    }, [QueryParam]);

    const fetchData = useCallback(async () => {
        const cachedData = await AsyncStorage.getItem('followersAndFollowing');
        if (cachedData) {
            setFollowersAndFollowing(JSON.parse(cachedData));
        }
        const querySnapshot = await db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('following_followers')
            .limit(1)
            .get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const docRef = doc.ref;
            // Define snapshot listener function
            return docRef.onSnapshot((snapshot) => {
                const data = snapshot.data();
                setFollowersAndFollowing({
                    id: snapshot.id,
                    followers: data.followers,
                    following: data.following,
                });

                // Update cached data
                AsyncStorage.setItem('followersAndFollowing', JSON.stringify({
                    id: 0,
                    followers: 0,
                    following: 0,
                }));
            }, (error) => {
                console.error("Error listening to document:", error);
                return () => { };
            });

        } else {
            console.log("No document found in the collection.");
            return () => { };
        }
    }, []);


    return { followersData, followingData, followersAndFollowing }
}

export default useCurrentUserFollowing