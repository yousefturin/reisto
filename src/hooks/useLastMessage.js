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
import { Alert } from "react-native";
import { GenerateRoomId } from '../utils/GenerateChatId';
import { useCallback, useEffect, useState } from 'react';

const useLastMessage = (userData, item, onUpdateLastMessage, flag, setMessagesNum) => {
    const [loading, setLoading] = useState(true);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const subscription = fetchMassages();

        return () => {
            if (subscription && typeof subscription === 'function') {
                subscription.subscription();
            }
        }
    }, []);

    const fetchMassages = useCallback(async () => {
        const user = firebase.auth().currentUser;
        if (user) {
            let roomId = GenerateRoomId(userData.owner_uid, item.owner_uid);
            const messageQuery = db.collection('messages').doc(roomId).collection('private_messages').orderBy('createdAt', 'desc')
            return messageQuery.onSnapshot(snapshot => {
                try {
                    let unseenMessages = 0;
                    let allMessages = snapshot.docs.map(doc => doc.data());
                    const latestMessage = allMessages[0] || null;
                    unseenMessages = allMessages.filter(message => !message.seenBy.includes(userData.owner_uid));
                    setLoading(false);
                    setMessagesNum(unseenMessages.length);
                    setLastMessage(latestMessage);
                    // The messages are currently indexed in Firebase without considering the user's id,
                    // so a second sort is needed to properly display the messages order.
                    if (flag === "FromMain") onUpdateLastMessage(item.owner_uid, latestMessage);

                } catch (error) {
                    console.error('Error fetching messages:', error);
                    Alert.alert(error.message);
                    setLoading(false);
                }
            }, error => {
                return () => { };
            });

        } else {
            console.error("No authenticated user found.");
            return () => { }; // Return null if user is not authenticated
        }
    }, []);

    return { loading, lastMessage }
}

export default useLastMessage