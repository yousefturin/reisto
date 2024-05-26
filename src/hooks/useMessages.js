import { db, firebase } from "../firebase";
import { useCallback, useEffect, useState } from 'react';


const useMessages = (Param) => {
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [excludedUsers, setExcludedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        const user = firebase.auth().currentUser.email
        if (!user) {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        } else {
            unsubscribe = fetchData();
        }
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            if (unsubscribe ) {
                // Call the unsubscribe function to stop listening to Firestore updates
                unsubscribe.unsubscribe;
            }
        };
    }, [fetchData])

    const fetchData = useCallback(async () => {
        try {
            // search the messages based on the current user id and fetch those messages
            const messagesQuery1 = db.collection('messages')
                .where('owner1', '==', Param);
            const messagesQuery2 = db.collection('messages')
                .where('owner2', '==', Param);

            // Subscribe to the query snapshot to receive real-time updates
            return messagesQuery1.onSnapshot((snapshot1) => {
                messagesQuery2.onSnapshot((snapshot2) => {
                    // Set to store unique matching private messages
                    const uniquePrivateMessages = new Set();

                    // Iterate through the messages to obtain the email id linked to users collection
                    snapshot1.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== Param) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== Param) {
                            uniquePrivateMessages.add(owner2);
                        }
                    });

                    snapshot2.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== Param) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== Param) {
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
                            if (userDataDb.length === 0) {
                                setLoading(null);
                            } else {
                                setLoading(false);
                                setUsersForMessaging(userDataDb);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching user data:", error);
                        });
                });
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            });
        } catch (error) {
            console.error("Error fetching data from Messages:", error);
            return () => { };
        }
    }, [Param]);

    return { usersForMessaging, excludedUsers, loading }
}

export default useMessages