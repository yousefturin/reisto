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




import { Animated, FlatList } from 'react-native'
import React from 'react'
import MessageMainItem from './MessageMainItem'
import MessageLoadingPlaceHolder from './MessageLoadingPlaceHolder'
import EmptyDataParma from '../CustomComponent/EmptyDataParma'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MessageMainList = ({ updateLastMessage,
    userData, sortedData,
    usersForMessaging, flag,
    theme, t, loading,
    scrollY,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScrollEndDrag }) => {
    // this is the main list of messages that the user has
    if (flag === "FromMain") {
        return (
            <>
                {
                    loading === false ? (
                        <AnimatedFlatList
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollBegin={onMomentumScrollBegin}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            onScrollEndDrag={onScrollEndDrag}
                            scrollEventThrottle={4}
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
                            style={{ paddingTop: 100, paddingBottom: 50 }}
                        />
                    ) : (
                        loading === null ? (
                            <EmptyDataParma SvgElement={"EditIllustration"} theme={theme} t={t} TitleDataMessage={"Start a new chat"} dataMessage={"Send your friend a message. You can always come back and check for new messages."} />
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
                        <AnimatedFlatList
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollBegin={onMomentumScrollBegin}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            onScrollEndDrag={onScrollEndDrag}
                            scrollEventThrottle={4}
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
                            style={{ paddingTop: 100, paddingBottom: 50 }}
                        />
                    ) : loading === null ? (
                        <EmptyDataParma SvgElement={"AddUserIllustration"} theme={theme} t={t} TitleDataMessage={"Make new connections"} dataMessage={"Connect with new people to start messaging. All new followings will appear here."} />
                    ) : (
                        <MessageLoadingPlaceHolder theme={theme} />
                    )
                }
            </>

        )
    }
}

export default MessageMainList