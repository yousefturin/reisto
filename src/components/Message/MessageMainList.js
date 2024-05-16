import { FlatList } from 'react-native'
import React from 'react'
import MessageMainItem from './MessageMainItem'
import MessageLoadingPlaceHolder from './MessageLoadingPlaceHolder'
import EmptyDataParma from '../CustomComponent/EmptyDataParma'

const MessageMainList = ({ updateLastMessage, userData, sortedData, usersForMessaging, flag, theme, t, loading }) => {
    // this is the main list of messages that the user has
    if (flag === "FromMain") {
        return (
            <>
                {
                    loading === false ? (
                        <FlatList
                            data={sortedData}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={'always'}
                            renderItem={({ item, index }) => <MessageMainItem
                                item={item} index={index}
                                userData={userData} t={t}
                                onUpdateLastMessage={updateLastMessage}
                                flag={"FromMain"}
                                theme={theme}
                            />}
                            keyExtractor={item => item.owner_uid.toString()}
                        />
                    ) : (
                        loading === null ? (
                            <EmptyDataParma SvgElement={"EditIllustration"} theme={theme} t={t} TitleDataMessage={"Start new chat"} dataMessage={"Send your friend message. You can always come back and check new messages."} />
                        ) : (
                            <MessageLoadingPlaceHolder theme={theme} />
                        )
                    )
                }
            </>
        )
        // this is the list of users that the user can start a chat with
    } if (flag === "FromNewMessage") {
        return (
            <>
                {
                    loading === false ? (
                        <FlatList
                            data={usersForMessaging}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps={'always'}
                            renderItem={({ item, index }) => <MessageMainItem
                                item={item} index={index}
                                userData={userData}
                                flag={"FromNewMessage"}
                                theme={theme} t={t}
                            />}
                            keyExtractor={item => item.owner_uid.toString()}
                        />
                    ) : loading === null ? (
                        <EmptyDataParma SvgElement={"AddUserIllustration"} theme={theme} t={t} TitleDataMessage={"Make new connections"} dataMessage={"Connect with new people to start messaging. All new following will appear here."} />
                    ) : (
                        <MessageLoadingPlaceHolder theme={theme} />
                    )
                }
            </>

        )
    }
}

export default MessageMainList