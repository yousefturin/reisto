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
                            style={{ paddingTop: 100, paddingBottom: 150 }}
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
                            style={{ paddingTop: 100, paddingBottom: 150 }}
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