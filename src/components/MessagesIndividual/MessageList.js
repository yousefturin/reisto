import { ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import * as Haptics from 'expo-haptics';
// onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft) }}
const MessageList = ({ messages, currentUser, scrollViewRef, theme }) => {
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
                        <TouchableOpacity key={index} >
                            <MessageItem message={message} key={index} currentUser={currentUser} theme={theme} />
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    )
}

export default MessageList