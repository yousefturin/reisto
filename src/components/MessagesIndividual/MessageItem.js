import { View, Text } from 'react-native'
import React from 'react'

const MessageItem = ({ message, currentUser }) => {

    if (currentUser?.owner_uid == message.owner_id) {
        //this message is sent by me
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, marginRight: 10 }}>
                <View style={{ alignItems: 'flex-end', maxWidth: '80%' }}>
                    <View style={{ backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                            {message?.text}
                        </Text>
                    </View>
                    <View style={{ width: 0, height: 0, borderTopWidth: 10, borderTopColor: 'transparent', borderRightWidth: 10, borderRightColor: '#007AFF', borderBottomWidth: 10, borderBottomColor: 'transparent', transform: [{ rotate: '90deg' }], marginTop: -20, marginRight: 2 }} />
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, marginLeft: 10 }}>
                <View style={{ alignItems: 'flex-start', maxWidth: '80%' }}>
                    <View style={{ backgroundColor: '#262626', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                            {message?.text}
                        </Text>
                    </View>
                    <View style={{ width: 0, height: 0, borderTopWidth: 10, borderTopColor: 'transparent', borderRightWidth: 10, borderRightColor: '#262626', borderBottomWidth: 10, borderBottomColor: 'transparent', transform: [{ rotate: '90deg' }], marginTop: -20, marginLeft: 2 }} />
                </View>
            </View>
        )
    }
}

export default MessageItem