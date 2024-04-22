import React, { useLayoutEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import MessageMainList from '../components/Message/MessageMainList';



const MessagingNewForFollowersAndFollowingScreen = ({ route }) => {
    // the users that the current user did start a chat will be excluded from the list of users that the user can start a chat with.
    const { userData, excludedUsers } = route.params;
    const [usersForMessaging, setUsersForMessaging] = useState([]);

    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(userData.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = [];
                const fetchPromisesSecond = [];

                for (const follower of data.followers) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];

                const uniqueUserIds = new Set();
                const filteredUsersData = allUsersData.filter(user => {
                    if (uniqueUserIds.has(user.owner_uid) || excludedUsers.includes(user.email)) {
                        return false;
                    } else {
                        uniqueUserIds.add(user.owner_uid);
                        return true;
                    }
                });

                setUsersForMessaging(filteredUsersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <EditProfileHeader headerTitle={"New message"} navigation={navigation} />
            <MessageMainList usersForMessaging={usersForMessaging} userData={userData} flag={"FromNewMessage"} />
        </SafeAreaView>
    );
};

export default MessagingNewForFollowersAndFollowingScreen;