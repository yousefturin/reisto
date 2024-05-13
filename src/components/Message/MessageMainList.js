import { FlatList } from 'react-native'
import React from 'react'
import MessageMainItem from './MessageMainItem'
import MessageLoadingPlaceHolder from './MessageLoadingPlaceHolder'

const MessageMainList = ({ updateLastMessage, userData, sortedData, usersForMessaging, flag, theme }) => {
    // this is the main list of messages that the user has
    if (flag === "FromMain") {
        return (
            <>
                {
                    sortedData.length !== 0 ? (
                        <FlatList
                            data={sortedData}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={'always'}
                            renderItem={({ item, index }) => <MessageMainItem
                                item={item} index={index}
                                userData={userData}
                                onUpdateLastMessage={updateLastMessage}
                                flag={"FromMain"}
                                theme={theme}
                            />}
                            keyExtractor={item => item.owner_uid.toString()}
                        />
                    ) : (
                        <MessageLoadingPlaceHolder  theme={theme}/>
                    )
                }
            </>
        )
        // this is the list of users that the user can start a chat with
    } if (flag === "FromNewMessage") {
        return (
            <>
                {
                    usersForMessaging.length !== 0 ? (
                        <FlatList
                            data={usersForMessaging}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={'always'}
                            renderItem={({ item, index }) => <MessageMainItem
                                item={item} index={index}
                                userData={userData}
                                flag={"FromNewMessage"}
                                theme={theme}
                            />}
                            keyExtractor={item => item.owner_uid.toString()}
                        />
                    ) : (
                        <MessageLoadingPlaceHolder theme={theme} />
                    )
                }
            </>

        )
    }
}

export default MessageMainList