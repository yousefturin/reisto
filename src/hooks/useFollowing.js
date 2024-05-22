import { db, firebase } from "../firebase";
import { useEffect, useState } from 'react';

const useFollowing = (QueryParam) => {
    const [followersAndFollowing, setFollowersAndFollowing] = useState(null);
    const [followersAndFollowingForPassedUser, setFollowersAndFollowingForPassedUser] = useState({ id: "", followers: "", following: "", });

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
                    }, (error) => {
                        console.error("Error listening to current user's document:", error);
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
                        console.error("Error listening to passed user's document:", error);
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
            }
        };

        getFollowersAndFollowingData();

        return () => {
            // Unsubscribe when component unmounts
            unsubscribeCurrentUser && unsubscribeCurrentUser();
            unsubscribePassedUser && unsubscribePassedUser();
        };
    }, [QueryParam]);

    return { followersAndFollowing, followersAndFollowingForPassedUser };
}

export default useFollowing