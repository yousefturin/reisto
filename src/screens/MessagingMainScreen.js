import { SafeAreaView, } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import MessageMainHeader from '../components/Message/MessageMainHeader'
import { UserContext } from '../context/UserDataProvider'
import { db } from '../firebase'
import MessageLoadingPlaceHolder from '../components/Message/MessageLoadingPlaceHolder'
import MessageMainList from '../components/Message/MessageMainList'
import MessageMainSearchBar from '../components/Message/MessageMainSearchBar'

// all of the fetching will be moved to a provider and everything will be fetched on an auth stage so the app works fast as fuck.-<<<<<(fixed with batch fetching)

const MessagingMainScreen = () => {
    const userData = useContext(UserContext);
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [RightIconContainerStyle, setRightIconContainerStyle] = useState(1);
    const [excludedUsers, setExcludedUsers] = useState([])
    const [sortedData, setSortedData] = useState([]);
    useLayoutEffect(() => {
        fetchData();
    }, []);

    // This code was previously fetching all messages based on following and followers users, but now it will only show the messages that the user has sent.
    // The performance of fetching has improved significantly by optimizing the query and using batch fetching.
    const fetchData = async () => {
        try {
            // search the messages based on the current user id and fetch those messages
            // roomId fetching was a problem to manage so now it will be only using the subIds
            const messagesQuery1 = db.collection('messages')
                .where('owner1', '==', userData.email);
            const messagesQuery2 = db.collection('messages')
                .where('owner2', '==', userData.email);

            // Subscribe to the query snapshot to receive real-time updates
            const unsubscribe = messagesQuery1.onSnapshot((snapshot1) => {
                messagesQuery2.onSnapshot((snapshot2) => {
                    // Set to store unique matching private messages
                    const uniquePrivateMessages = new Set();

                    // Iterate through the messages to obtain the email id linked to users collection
                    snapshot1.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== userData.email) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== userData.email) {
                            uniquePrivateMessages.add(owner2);
                        }
                    });

                    snapshot2.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== userData.email) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== userData.email) {
                            uniquePrivateMessages.add(owner2);
                        }
                    });

                    // Convert the Set back to an array
                    const matchingPrivateMessages = Array.from(uniquePrivateMessages);

                    // map users data to the matchingPrivateMessages array
                    const fetchPromises = matchingPrivateMessages.map(userId =>
                        db.collection('users').doc(userId).get()
                    );

                    Promise.all(fetchPromises)
                        .then((userDocs) => {
                            // map the user data to the userDocs array
                            const userDataDb = userDocs.map(userDoc => userDoc.data());

                            // set the excluded users to the matchingPrivateMessages array
                            setExcludedUsers(matchingPrivateMessages);

                            // set the users data to the state
                            setUsersForMessaging(userDataDb);
                        })
                        .catch((error) => {
                            console.error("Error fetching user data:", error);
                        });
                });
            });

            // Return the unsubscribe function to stop listening for updates
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    // this was moved from the MainMessageList.js to here to make the code more readable and to make the code more optimized
    //#region Update last message
    // Update last message for a specific user
    const updateLastMessage = useCallback((userId, message) => {
        // console.log("updateLastMessage", message.seenBy);
        setSortedData(prevData => {
            const newData = prevData.map(item => {
                if (item.owner_uid === userId) {
                    return {
                        ...item,
                        lastMessage: message
                    };
                }
                return item;
            });

            // Sort data based on lastMessage.createdAt
            newData.sort((a, b) => {
                const createdAtA = (a.lastMessage && a.lastMessage.createdAt) || null;
                const createdAtB = (b.lastMessage && b.lastMessage.createdAt) || null;

                // Handle null values
                if (createdAtA === null && createdAtB === null) {
                    return 0;
                } else if (createdAtA === null) {
                    return 1; // Place items without createdAt at the end
                } else if (createdAtB === null) {
                    return -1; // Place items without createdAt at the end
                }

                // Convert Firestore Timestamps to milliseconds
                // hour of debugging 
                const createdAtMillisA = createdAtA.toMillis();
                const createdAtMillisB = createdAtB.toMillis();

                // Sort based on createdAtMillis
                return createdAtMillisB - createdAtMillisA;
            });

            return newData;
        });
    }, []);
    //#endregion

    useEffect(() => {
        // Initialize sorted data
        setSortedData([...usersForMessaging]);
    }, [usersForMessaging]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <MessageMainHeader excludedUsers={excludedUsers} userData={userData} />
            <MessageMainSearchBar RightIconContainerStyle={RightIconContainerStyle} />
            {usersForMessaging.length !== 0 ? (
                <>
                    <MessageMainList usersForMessaging={usersForMessaging}
                        userData={userData} sortedData={sortedData}
                        updateLastMessage={updateLastMessage} flag={"FromMain"} />
                </>
            ) : (
                <MessageLoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}

export default MessagingMainScreen