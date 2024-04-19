import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'

const MessageList = ({ messages, currentUser, scrollViewRef }) => {
    return (
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: 20
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={'always'}>
            {
                messages.map((message, index) => {
                    return (
                        <MessageItem message={message} key={index} currentUser={currentUser} />
                    )
                })
            }
        </ScrollView>
    )
}

export default MessageList