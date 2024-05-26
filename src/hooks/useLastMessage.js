
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
                    //this code need more observation for behavior
                    unseenMessages = allMessages.filter(message => !message.seenBy.includes(userData.owner_uid));
                    setLoading(false);
                    setMessagesNum(unseenMessages.length);
                    setLastMessage(latestMessage);
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