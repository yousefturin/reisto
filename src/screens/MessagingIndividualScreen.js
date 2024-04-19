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
import { addDoc, collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';



// two hours of debugging and then it apparently was userDataUid.owner_id and not userDataUid.owner_uid-<<<<<<<<(fixed)
const MessagingIndividualScreen = ({ route }) => {
    const { userDataUid } = route.params
    const userData = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    useEffect(() => {
        handleCreateChat();
        try {
            let roomId = GenerateRoomId(userData?.owner_uid, userDataUid.owner_uid);
            console.log(roomId)
            const DocRef = doc(db, 'messages', roomId)
            const messagesRef = collection(DocRef, "private_messages");
            const qu = query(messagesRef, orderBy('createdAt', 'asc'));

            let unsubscribe = onSnapshot(qu, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => {
                    return doc.data();
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

    const handleCreateChat = async () => {
        let roomId = GenerateRoomId(userData?.owner_uid, userDataUid.owner_uid);
        try {
            const roomRef = db.collection('messages').doc(roomId);
            const roomSnap = await roomRef.get();

            if (!roomSnap.exists) { // Check if the document exists
                await roomRef.set({
                    roomId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }
    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = GenerateRoomId(userData?.owner_uid, userDataUid.owner_uid);
            const DocRef = db.collection('messages').doc(roomId)
            const messagesRef = collection(DocRef, "private_messages");
            //clear the message after it send
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear()
            const newDoc = await addDoc(messagesRef, {
                owner_id: userData?.owner_uid,
                text: message,
                profile_picture: userData?.profile_picture,
                sender_name: userData?.username,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        } catch (error) {
            Alert.alert(error.message);
        }
    }
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
                                    onChangeText={value => textRef.current = value}
                                    placeholder={`Type message for ${userDataUid.username}...`}
                                    placeholderTextColor={"#383838"}
                                    style={{ flex: 1, margin: 17, color: "#ffff" }}
                                />
                                <TouchableOpacity onPress={handleSendMessage}
                                    style={{ justifyContent: "center" }}>
                                    <LinearGradient
                                        // Button Linear Gradient
                                        colors={['#7e9bdf', '#6581B7', '#445379']}
                                        style={{ marginRight: 7, padding: 7, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                        <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={'#ffffff'} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default MessagingIndividualScreen