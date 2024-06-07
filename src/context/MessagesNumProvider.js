/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import React, { createContext, useEffect, useState } from 'react';
import { db, firebase } from '../firebase';


// Create a new context
const MessagesNumContext = createContext();

// Create a context provider component
const MessagesNumProvider = ({ children }) => {
    // State to hold the number of messages
    const [messagesNum, setMessagesNum] = useState([]);
    const [loading, setLoading] = useState(true);

    // Declare the unsubscribe variable
    useEffect(() => {
        const messagesQuery1 = db.collection('messages')
            .where('owner1', '==', firebase.auth().currentUser.email)
            .orderBy('createdAt', 'desc')
            .limit(1);
        const messagesQuery2 = db.collection('messages')
            .where('owner2', '==', firebase.auth().currentUser.email)
            .orderBy('createdAt', 'desc')
            .limit(1);

        const privateMessagesPromises = [];

        const unsubscribe = messagesQuery1.onSnapshot(async (snapshot1) => {
            snapshot1.forEach(async (messageDoc) => {
                const privateMessagesRef = messageDoc.ref.collection('private_messages')
                    .orderBy('createdAt', 'desc')
                    .limit(1);
                privateMessagesPromises.push(privateMessagesRef.get());
            });

            const snapshot2 = await messagesQuery2.get();
            snapshot2.forEach(async (messageDoc) => {
                const privateMessagesRef = messageDoc.ref.collection('private_messages')
                    .orderBy('createdAt', 'desc')
                    .limit(1);
                privateMessagesPromises.push(privateMessagesRef.get());
            });

            const privateMessagesSnapshots = await Promise.all(privateMessagesPromises);

            const uniquePrivateMessages = new Set();

            privateMessagesSnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((privateMessageDoc) => {
                    const privateMessageData = privateMessageDoc.data();
                    if (!privateMessageData.seenBy.includes(firebase.auth().currentUser.uid)) {
                        uniquePrivateMessages.add(privateMessageData);
                    }
                });
            });
            // Update the number of messages
            setMessagesNum(uniquePrivateMessages.size);
            setLoading(false);
        }, error => {
            console.error("Error listening to document:", error);
            return () => { };
        });

        // Clean up the subscription when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [messagesNum]);

    // Value object to be passed to consumers
    const value = {
        messagesNum,
        loadingMessagesNum: loading,
        setMessagesNum
    };

    return (
        <MessagesNumContext.Provider value={value}>
            {children}
        </MessagesNumContext.Provider>
    );
};

export { MessagesNumContext, MessagesNumProvider };




