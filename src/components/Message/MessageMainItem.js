/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';
import { useNavigation } from '@react-navigation/native'
import { Skeleton } from 'moti/skeleton';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculator';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { MessagesNumContext } from '../../context/MessagesNumProvider';
import useLastMessage from '../../hooks/useLastMessage';


const MessageMainItem = ({ item, userData, onUpdateLastMessage, flag, theme, t }) => {
    const navigation = useNavigation();
    const { setMessagesNum } = useContext(MessagesNumContext);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const { loading, lastMessage } = useLastMessage(userData, item, onUpdateLastMessage, flag, setMessagesNum);
    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark' : 'light',
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
    }

    const handleNavigationToChat = (userDataUid) => {
        navigation.navigate('MessageIndividual', { userDataUid });
    };

    const renderTime = () => {
        if (lastMessage && lastMessage.createdAt) {
            let date = lastMessage.createdAt;
            const dataFormatted = calculateTimeDifference(date, t);
            return dataFormatted + " " + `${t('screens.messages.timeRender')}`;
        } else {
            return '';
        }
    }

    const renderLastMessage = () => {
        // If I am the sender, show "You"
        // No need to use the "?" here since the condition is already checked before
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
            </TouchableOpacity>
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