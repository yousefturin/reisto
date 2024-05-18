import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';
import { useNavigation } from '@react-navigation/native'
import { GenerateRoomId } from '../../utils/GenerateChatId';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Skeleton } from 'moti/skeleton';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculator';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { MessagesNumContext } from '../../context/MessagesNumProvider';


const MessageMainItem = ({ item, userData, onUpdateLastMessage, flag, theme, t }) => {
    const navigation = useNavigation();
    const { setMessagesNum } = useContext(MessagesNumContext);
    const [lastMessage, setLastMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark' : 'light',
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
    }

    useEffect(() => {
        let roomId = GenerateRoomId(userData.owner_uid, item.owner_uid);
        const DocRef = doc(db, 'messages', roomId);
        const messagesRef = collection(DocRef, "private_messages");
        const qu = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsubscribe;
        try {
            unsubscribe = onSnapshot(qu, (snapshot) => {
                let unseenMessages = 0;
                let allMessages = snapshot.docs.map(doc => doc.data());
                const latestMessage = allMessages[0] || null;
                //this code need more observation for behavior
                unseenMessages = allMessages.filter(message => !message.seenBy.includes(userData.owner_uid));
                setLoading(false);
                setMessagesNum(unseenMessages.length);
                setLastMessage(latestMessage);
                if (flag === "FromMain") onUpdateLastMessage(item.owner_uid, latestMessage);
                
            });
        } catch (error) {
            Alert.alert(error.message);
            setLoading(false);
        }

        return () => {
            // clearTimeout(timer);
            unsubscribe && unsubscribe();
        };
    }, []);

    const handleNavigationToChat = (userDataUid) => {
        navigation.navigate('MessageIndividual', { userDataUid });
    };

    const renderTime = () => {
        if (lastMessage && lastMessage.createdAt) {
            let date = lastMessage.createdAt;
            const dataFormatted = calculateTimeDifference(date, t);
            return dataFormatted + " " +`${t('screens.messages.timeRender')}`;
        } else {
            return '';
        }
    }
    
    const renderLastMessage = () => {
        // if i am who sent then show the you 
        // not need to use the ? here since the condition is already will be passed only if it exist
        if (userData?.owner_uid == lastMessage.owner_id) {
            return (
                <>
                    {
                        lastMessage?.seenBy.includes(userData.owner_uid) ? (
                            <View style={{ flexDirection: "row-reverse", gap: 2, }}>
                                <>
                                    {lastMessage.text === null ? (
                                        <Text style={{ color: theme.textSecondary, fontSize: 15, fontWeight: "500", }} numberOfLines={1} ellipsizeMode="tail">{t('screens.messages.messagesMain.messagesISent.title')}</Text>

                                    ) : (
                                        <Text style={{ color: theme.textSecondary, fontSize: 15, fontWeight: "500", }} numberOfLines={1} ellipsizeMode="tail">{lastMessage?.text}</Text>

                                    )}
                                </>
                                <View style={{ alignSelf: "center" }}>
                                    <SvgComponent svgKey="CheckSVG" width={moderateScale(13)} height={moderateScale(13)} stroke={theme.textSecondary} />
                                </View>
                            </View>
                        ) : (
                            null
                        )
                    }
                </>
            )
        }

        else if (lastMessage.text === null) {
            // if not me the just show it normally
            return <View style={{ flexDirection: "row-reverse", gap: 2, }}>
                {!lastMessage.seenBy.includes(userData.owner_uid) ? (
                    <Text style={{ color: !lastMessage.seenBy.includes(userData.owner_uid) ? theme.textPrimary : theme.textSecondary, fontSize: 15, fontWeight: !lastMessage.seenBy.includes(userData.owner_uid) ? "700" : "500", }} numberOfLines={1} ellipsizeMode="tail"  >{t('screens.messages.messagesMain.messagesIReceived.title')}</Text>
                ) : (
                    <Text style={{ color: !lastMessage.seenBy.includes(userData.owner_uid) ? theme.textPrimary : theme.textSecondary, fontSize: 15, fontWeight: !lastMessage.seenBy.includes(userData.owner_uid) ? "700" : "500", }} numberOfLines={1} ellipsizeMode="tail"  >{t('screens.messages.messagesMain.messagesIReceived.action')}</Text>
                )}
                {/* // if the user did not fetch the last message then show the dot as it indicate that the message is not seen yet by the user */}
                <View style={{ alignSelf: "center" }}>
                    {lastMessage?.seenBy.includes(userData.owner_uid) ? (
                        <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(13)} height={moderateScale(13)} stroke={theme.textSecondary} />
                    ) : (
                        null
                    )}
                </View>
            </View>
        }

        // if not me the just show it normally
        return <View style={{ flexDirection: "row-reverse", gap: 2, }}>
            <Text style={{ color: !lastMessage.seenBy.includes(userData.owner_uid) ? theme.textPrimary : theme.textSecondary, fontSize: 15, fontWeight: !lastMessage.seenBy.includes(userData.owner_uid) ? "700" : "500", }} numberOfLines={1} ellipsizeMode="tail"  >{lastMessage?.text}</Text>
            {/* // if the user did not fetch the last message then show the dot as it indicate that the message is not seen yet by the user */}
            <View style={{ alignSelf: "center" }}>
                {lastMessage?.seenBy.includes(userData.owner_uid) ? (
                    <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(13)} height={moderateScale(13)} stroke={theme.textSecondary} />
                ) : (
                    null
                )}
            </View>
        </View>
    }

    if (flag === "FromMain") {
        return (
            <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 10 }} onPress={() => handleNavigationToChat(item)}>
                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={{ uri: item.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 50,
                            margin: 7,
                            borderWidth: 1.5,
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        transition={50}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                    />
                </View>
                <View style={{ flexDirection: "column", flex: 0.55, justifyContent: "center", alignItems: "flex-start" }}>

                    <Text style={{ color: theme.textPrimary, fontWeight: lastMessage && lastMessage.seenBy?.includes(userData.owner_uid) ? "700" : "900", fontSize: 16 }}>{item.username}</Text>
                    {loading ? (
                        <Skeleton
                            show
                            height={10}
                            width={120}
                            {...SkeletonCommonProps}
                        />
                    ) : (
                        <>
                            {lastMessage ? renderLastMessage() : <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{t('screens.messages.defaultMessage')}</Text>}
                        </>
                    )}
                </View>
                <View style={{ flex: 0.05, justifyContent: "center", alignItems: "center" }}>
                    {loading ? (
                        null
                    ) : (
                        <>
                            {lastMessage && lastMessage.seenBy?.includes(userData.owner_uid) ? (
                                null
                            ) : (
                                <SvgComponent svgKey="DotSVG" width={moderateScale(8)} height={moderateScale(8)} fill={theme.textPrimary} />
                            )}
                        </>
                    )}

                </View>
                <View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{lastMessage ? renderTime() : ''}</Text>
                </View>
            </TouchableOpacity >
        );
    }

    if (flag === "FromNewMessage") {
        return (
            <TouchableOpacity style={{ flexDirection: "row", marginHorizontal: 10 }} onPress={() => handleNavigationToChat(item)}>
                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={{ uri: item.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 50,
                            margin: 7,
                            borderWidth: 1.5,
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        transition={50}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                    />
                </View>
                <View style={{ flexDirection: "column", width: "60%", justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                    {/* just to style the username in the center if there is no display_name to be shown */}
                    {item.displayed_name ? <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text> : <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{t('screens.messages.defaultMessage')}</Text>}
                </View>
            </TouchableOpacity>
        )
    }


};

export default MessageMainItem