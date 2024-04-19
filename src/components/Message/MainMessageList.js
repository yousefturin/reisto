import { FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MessageMainItem from './MessageMainItem'

const MainMessageList = ({ usersForMessaging, userData }) => {
    const [sortedData, setSortedData] = useState([]);

    // Update last message for a specific user
    const updateLastMessage = useCallback((userId, message) => {
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

    useEffect(() => {
        // Initialize sorted data
        setSortedData([...usersForMessaging]);
    }, [usersForMessaging]);
    return (
        <FlatList
            data={sortedData}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={'always'}
            renderItem={({ item, index }) => <MessageMainItem
                item={item} index={index}
                userData={userData}
                onUpdateLastMessage={updateLastMessage}
            />}
            keyExtractor={item => item.owner_uid.toString()}
        />
    )
}

export default MainMessageList