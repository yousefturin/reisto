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
import { blurHash } from '../../assets/HashBlurData';
import UploadImageToStorage from '../../src/utils/UploadImageToStorage';

// two hours of debugging and then it apparently was userDataUid.owner_id and not userDataUid.owner_uid-<<<<<<<<(fixed)
const MessagingIndividualScreen = ({ route }) => {
    const { userDataUid } = route.params
    const userData = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [dummyState, setDummyState] = useState({});
    const [image, setImage] = useState(null);

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
        let message = textRef.current.trim();
        if (flag === blurHash) {
            imageToBeSent = base64Image;
            message = "Image"
        }
        handleCreateChat()
        if (!message) return;
        if (flag === blurHash) message = null;
        try {
            let roomId = GenerateRoomId(userData.owner_uid, userDataUid.owner_uid);
            const DocRef = db.collection('messages').doc(roomId)
            const messagesRef = collection(DocRef, "private_messages");
            //clear the message after it send
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear()
            const newDoc = await addDoc(messagesRef, {
                owner_id: userData?.owner_uid,
                text: message,
                image: imageToBeSent,
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

    const forceUpdate = () => {
        // Update the dummy state to trigger a re-render
        setDummyState({});
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
                handleSendMessage(blurHash, base64Image);
            }
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <MessagesIndividualHeader header={userDataUid} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={30}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}>
                    <View style={{ flex: 1, backgroundColor: "#050505", justifyContent: "space-between" }}>
                        <View style={{ flex: 1 }}>
                            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={userData} />
                        </View>
                        <View style={{ marginBottom: 10, paddingTop: 20, }}>
                            <View style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-between", backgroundColor: "#050505", borderRadius: 50, borderWidth: 0.5, borderColor: "#2b2b2b" }}>
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={handleChangeText}
                                    placeholder={`Type message for ${userDataUid.username}...`}
                                    placeholderTextColor={"#383838"}
                                    style={{ flex: 1, margin: 17, color: "#ffff" }}
                                />
                                {textRef.current !== "" ? (
                                    <TouchableOpacity onPress={handleSendMessage}
                                        style={{ justifyContent: "center" }}>
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={['#007AFF', '#007AFF', '#007AFF']}
                                            style={{ marginRight: 9, padding: 7, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                            <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={'#ffffff'} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleSelectImage()}
                                        style={{ justifyContent: "center" }}>
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={['#2b2b2b', '#2b2b2b', '#2b2b2b']}
                                            style={{ marginRight: 9, padding: 7, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                            <SvgComponent svgKey="ImageSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default MessagingIndividualScreen