/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MessageItem from './MessageItem'
import * as Haptics from 'expo-haptics';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { GenerateRoomId } from '../../utils/GenerateChatId';
import { db } from '../../firebase';

const MessageList = ({ messages, currentUser, scrollViewRef, theme, forwarded }) => {
    const [messageId, setMessageId] = useState(null)
    const [messageDimensions, setMessageDimensions] = useState({});
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const dynamicPositionStyle = (message) => {
        return message.owner_id === currentUser.owner_uid
            ? { left: messageDimensions[message.id].width }
            : { right: messageDimensions[message.id].width };
    };
    const dynamicTransformStyle = (message, whichView) => {
        if (whichView === "emoji") {
            return message.owner_id === currentUser.owner_uid
                ? -240
                : 240;
        } else {
            return message.owner_id === currentUser.owner_uid
                ? -20
                : 20;
        }
    };

    const Icons = [
        {
            action: 'Angry',
            url: 'AngryEmoji'
        },
        {
            action: 'Cry',
            url: 'CryingEmoji'
        },
        {
            action: 'Happy',
            url: 'HappyEmoji'
        },
        {
            action: 'Sad',
            url: 'SadEmoji'
        },
        {
            action: 'Love',
            url: 'LoveEmoji'
        },


    ]
    const handleLayout = (event, message) => {
        const { width, height } = event.nativeEvent.layout;
        setMessageDimensions(prevState => ({
            ...prevState,
            [message.id]: { width, height }
        }));
    };

    const handleShowEmojiPicker = (message) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        setMessageId(message.id)
        setEmojiPickerVisible(true)
    }

    const handleEmojiLogic = (message) => {
        if (emojiPickerVisible === true) {
            if (message.id === messageId) {
                setEmojiPickerVisible(false)
            } else {
                handleShowEmojiPicker(message)
            }
        } else {
            handleShowEmojiPicker(message)
        }
    }
    // TODO: each user must give an emoji to the message. currently, it only changes the old emoji with the new one from the other user.
    const handleSendEmoji = async (emoji) => {
        let room = GenerateRoomId(currentUser.owner_uid, forwarded.owner_uid)
        setEmojiPickerVisible(false)
        const DocRef = db.collection('messages').doc(room).collection('private_messages').doc(messageId)
        await DocRef.update({
            emoji: emoji
        }).then(() => {
            console.log("Document successfully updated!");
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });
    }

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
                        <View key={index}>
                            <TouchableOpacity key={index} activeOpacity={0.9} onLongPress={() => handleEmojiLogic(message)}>
                                <View
                                    onLayout={(event) => handleLayout(event, message)}
                                >
                                    <MessageItem message={message} key={index} currentUser={currentUser} theme={theme} />
                                    {emojiPickerVisible === true && message.id === messageId && messageDimensions[message.id] &&
                                        <>
                                            <View style={{
                                                position: "absolute",
                                                bottom: messageDimensions[message.id].height,
                                                ...dynamicPositionStyle(message),
                                                width: 230,
                                                height: 40,
                                                backgroundColor: theme.Tertiary,
                                                zIndex: 1,
                                                borderRadius: 30,
                                                transform: [{ translateX: dynamicTransformStyle(message, "emoji") }, { translateY: -5 }]
                                            }}>
                                                <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                                    {Icons.slice(0, 5).map((icon, index) => (
                                                        <TouchableOpacity key={index} onPress={() => { handleSendEmoji(icon.url) }}>
                                                            <SvgComponent svgKey={icon.url} width={moderateScale(24)} height={moderateScale(24)} />
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                            <View style={{
                                                position: "absolute",
                                                bottom: messageDimensions[message.id].height - 20,
                                                ...dynamicPositionStyle(message),
                                                width: 10,
                                                height: 10,
                                                backgroundColor: theme.Tertiary,
                                                zIndex: 1,
                                                borderRadius: 9999,
                                                transform: [{ translateX: dynamicTransformStyle(message, null) }, { translateY: -15 }]
                                            }}></View>
                                        </>
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </ScrollView>
    )
}

export default MessageList