import { SafeAreaView, } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import MessageMainHeader from '../components/Message/MessageMainHeader'
import { UserContext } from '../context/UserDataProvider'
import { db } from '../firebase'
import MessageLoadingPlaceHolder from '../components/Message/MessageLoadingPlaceHolder'
import MainMessageList from '../components/Message/MainMessageList'
import MessageMainSearchBar from '../components/Message/MessageMainSearchBar'

// all of the fetching will be moved to a provider and everything will be fetched on an auth stage so the app works fast as fuck.-<<<<<(fixed with batch fetching)

const MessagingMainScreen = () => {
    const userData = useContext(UserContext);
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [RightIconContainerStyle, setRightIconContainerStyle] = useState(1);
    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(userData.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                // Initialize an array to store batched fetch promises
                const fetchPromises = [];

                // Push fetch promises for each follower-<<<<<<<< need to fix the issue where i have no idea what to show for users is it followers or following or both
                for (const follower of data.following) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                // Execute batched reads
                const followerDocs = await Promise.all(fetchPromises);

                // Extract data from follower documents
                const followersData = followerDocs
                    .filter(doc => doc.exists)
                    .map(doc => doc.data());

                setUsersForMessaging(followersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <MessageMainHeader userData={userData} />
            <MessageMainSearchBar RightIconContainerStyle={RightIconContainerStyle} />
            {usersForMessaging.length !== 0 ? (
                <>
                    <MainMessageList usersForMessaging={usersForMessaging} userData={userData} />
                </>
            ) : (
                <MessageLoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}

export default MessagingMainScreen