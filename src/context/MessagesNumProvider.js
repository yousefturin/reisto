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




import React, { createContext, useEffect, useState } from 'react';
import { db, firebase } from '../firebase';


// Create a new context
const MessagesNumContext = createContext();

// Create a context provider component
const MessagesNumProvider = ({ children }) => {
    // TODO: Value of messagesNum is not being updated when a messages is opened
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




