import { View, Text, Alert, SafeAreaView, Dimensions, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../context/UserDataProvider';
import { GenerateRoomId } from '../utils/GenerateChatId';
import { db, firebase } from '../firebase';
import MessagesIndividualHeader from '../components/MessagesIndividual/MessagesIndividualHeader';
import MessageList from '../components/MessagesIndividual/MessageList';
import initializeScalingUtils from '../utils/NormalizeSize';
import SvgComponent from '../utils/SvgComponents';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import UploadImageToStorage from '../../src/utils/UploadImageToStorage';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

// two hours of debugging and then it apparently was userDataUid.owner_id and not userDataUid.owner_uid-<<<<<<<<(fixed)
const MessagingIndividualScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userDataUid } = route.params
    const userData = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [_, setDummyState] = useState({});

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    useEffect(() => {
        // room creation is not needed here and will be only created on send message and then it will be checked if the room exists or not
        // handleCreateChat();
        try {
            let roomId = GenerateRoomId(userData.owner_uid, userDataUid.owner_uid);
            const DocRef = doc(db, 'messages', roomId)
            const messagesRef = collection(DocRef, "private_messages");
            const qu = query(messagesRef, orderBy('createdAt', 'asc'));

            const unsubscribe = onSnapshot(qu, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => {
                    let messageData = doc.data();
                    // Check if the current user is the recipient of the message
                    if (messageData.owner_id === userDataUid.owner_uid) {
                        // Mark the message as seen by the recipient
                        updateMessageSeenStatus(roomId, doc.id);
                    }
                    return messageData;
                })
                setMessages([...allMessages]);
            }, error => {
                return () => { };
            });
            const keyboardDidShowListener = Keyboard.addListener(
                'keyboardDidShow', updateScrollView
            )
            return () => {
                unsubscribe();
                keyboardDidShowListener.remove()
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }, [])

    useEffect(() => {
        updateScrollView();
    }, [messages])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 100)
    }
    // Function to update the seen status of a message
    const updateMessageSeenStatus = async (roomId, messageId) => {
        try {
            const messageRef = doc(db, 'messages', roomId, 'private_messages', messageId);
            await updateDoc(messageRef, {
                seenBy: firebase.firestore.FieldValue.arrayUnion(userData.owner_uid)
            });
        } catch (error) {
            console.error("Error updating message seen status:", error);
        }
    }

    const handleCreateChat = async () => {
        let roomId = GenerateRoomId(userData.owner_uid, userDataUid.owner_uid);
        try {
            const roomRef = db.collection('messages').doc(roomId);
            const roomSnap = await roomRef.get();

            if (!roomSnap.exists) { // Check if the document exists
                await roomRef.set({
                    roomId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    // first owner1 will always be the current user this is used in the main screen for messages to show the user who sent the message
                    owner1: userData.email,
                    owner2: userDataUid.email,
                });
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const handleSendMessage = async (flag, base64Image) => {
        let imageToBeSent = null
        let Post_Shared_id = null
        let messagePurpose = null
        let message = textRef.current.trim();

        // if send message is an image then
        if (flag === "image") {
            imageToBeSent = base64Image;
            message = null;
            messagePurpose = "image"
            // if message is text make sure it is not empty
        } else {
            if (!message) return;
            messagePurpose = "text"
        }
        handleCreateChat()
        try {
            let roomId = GenerateRoomId(userData.owner_uid, userDataUid.owner_uid);
            const DocRef = db.collection('messages').doc(roomId)
            const messagesRef = collection(DocRef, "private_messages");
            //clear the message after it send
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear()
            await addDoc(messagesRef, {
                owner_id: userData?.owner_uid,
                text: message,
                type_of_message: messagePurpose,
                image: imageToBeSent,
                shared_data: Post_Shared_id,
                profile_picture: userData?.profile_picture,
                sender_name: userData?.username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seenBy: [userData?.owner_uid]
            })
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const handleChangeText = (value) => {
        textRef.current = value;
        forceUpdate();
    };

    const handleSelectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // setImage(result.assets[0].uri);
            const maxWidth = 700; // Maximum width for resizing
            const originalWidth = result.assets[0].width;
            const originalHeight = result.assets[0].height;
            const aspectRatio = originalWidth / originalHeight;

            let width = originalWidth;
            let height = originalHeight;

            if (originalWidth > maxWidth) {
                width = maxWidth;
                // the issue with white border is that the height is for example 700.2314814814815 and that will make a problem 
                //              showing a artifact white line to fix teh issue rounding the number is applied.
                height = Math.round(maxWidth / aspectRatio)
            }
            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: width } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            const base64Image = await UploadImageToStorage(compressedImage.uri);
            if (base64Image) {
                handleSendMessage("image", base64Image);
            }
        }
    };

    const forceUpdate = () => {
        // Update the dummy state to trigger a re-render
        setDummyState({});
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <MessagesIndividualHeader header={userDataUid} theme={theme} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={10}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}>
                    <View style={{ flex: 1, backgroundColor: theme.Primary, justifyContent: "space-between" }}>
                        <View style={{ flex: 1 }}>
                            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={userData} theme={theme} />
                        </View>
                        <View style={{ marginBottom: 10, paddingTop: 20, }}>
                            <View style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-between", backgroundColor: theme.Primary, borderRadius: 50, borderWidth: 1, borderColor: theme.Secondary }}>
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={handleChangeText}
                                    placeholder={`${t('screens.messages.messageIndividual.messageInputPlaceHolder')} ${userDataUid.username} ${t('screens.messages.messageIndividual.messageInputPlaceHolderExtra')}...`}
                                    placeholderTextColor={theme.textPlaceholder}
                                    style={{ flex: 1, margin: 17, color: theme.textPrimary }}
                                />
                                {textRef.current !== "" ? (
                                    <TouchableOpacity onPress={handleSendMessage}
                                        style={{ justifyContent: "center" }}>
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={[theme.appPrimary, theme.appPrimary, theme.appPrimary]}
                                            style={{ marginRight: 9, padding: 7, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                            <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={theme.textPrimary} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleSelectImage()}
                                        style={{ justifyContent: "center" }}>
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={[theme.Secondary, theme.Secondary, theme.Secondary]}
                                            style={{ marginRight: 9, padding: 7, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                            <SvgComponent svgKey="ImageSVG" width={moderateScale(18)} height={moderateScale(18)} stroke={theme.textPrimary} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessagingIndividualScreen