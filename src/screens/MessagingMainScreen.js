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




import { Dimensions, SafeAreaView, StyleSheet, Text, Keyboard, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import MessageMainHeader from '../components/Message/MessageMainHeader'
import { UserContext } from '../context/UserDataProvider'
import MessageMainList from '../components/Message/MessageMainList'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { blurHash } from '../../assets/HashBlurData'
import { Divider, SearchBar } from 'react-native-elements'
import initializeScalingUtils from '../utils/NormalizeSize'
import { useNavigation } from '@react-navigation/native'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'
import { Animated } from 'react-native'
import useAnimation from '../hooks/useAnimation'
import useMessages from '../hooks/useMessages'

const { moderateScale } = initializeScalingUtils(Dimensions);

const MessagingMainScreen = () => {
    const { t } = useTranslation();

    const userData = useContext(UserContext);
    const [sortedData, setSortedData] = useState([]);
    const navigation = useNavigation();

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const { usersForMessaging, excludedUsers, loading } = useMessages(userData.email);

    const { headerTranslate, searchBarTranslate, opacity,
        opacitySearchBar, scrollY, onMomentumScrollBegin,
        onMomentumScrollEnd, onScrollEndDrag } = useAnimation("ScreensWithSearchBar", 120)

    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    const [RightIconContainerStyle, setRightIconContainerStyle] = useState(1);
    const [clearedManually, setClearedManually] = useState(true);
    const shouldDisplaySearchedItems = searchQuery !== "" || !clearedManually;

    const handleNavigationToMessages = (user) => {
        let userDataUid = user
        navigation.navigate('MessageIndividual', { userDataUid: userDataUid })
    }

    useEffect(() => {
        // Initialize sorted data
        setSortedData([...usersForMessaging]);
    }, [usersForMessaging]);

    //#region search bar functions
    const handleSearch = (query) => {
        setSearchQuery(query);
        setRightIconContainerStyle(1);
        const normalizedQuery = query.toLowerCase().replace(/[أإِ]/g, "ا");
        // Filter items based on the normalized search query and normalized item names
        const filtered = usersForMessaging.filter((item) => {
            const normalizedItemName = item.username.toLowerCase().replace(/[أإِ]/g, "ا");
            return normalizedItemName.includes(normalizedQuery);
        });

        setSearchedItems(filtered);
    };

    const handleSearchBarClick = () => {
        setSearchMode(true);
    };

    const handleCancel = () => {
        setRightIconContainerStyle(0);
        Keyboard.dismiss();
        setSearchQuery("");
        setSearchedItems([]);
        setSearchMode(false);
    };

    const handleClear = () => {
        setSearchQuery("");
        setSearchedItems([]);
        setClearedManually(true);
    }
    //#endregion

    // This function is used to update the last message of the user.
    // The sorting process has been improved with Firebase indexing.
    //#region Update last message
    const updateLastMessage = useCallback((userId, message) => {
        // This was moved from the MainMessageList.js to here to make the 
        //code more readable and to make the code more optimized
        setSortedData(prevData => {
            const newData = prevData.map(item => {
                if (item.owner_uid === userId) {
                    return {
                        ...item,
                        lastMessage: message
                    };
                }
                return item;
            });

            // Sort data based on lastMessage.createdAt
            newData.sort((a, b) => {
                const createdAtA = (a.lastMessage && a.lastMessage.createdAt) || null;
                const createdAtB = (b.lastMessage && b.lastMessage.createdAt) || null;

                // Handle null values
                if (createdAtA === null && createdAtB === null) {
                    return 0;
                } else if (createdAtA === null) {
                    return 1; // Place items without createdAt at the end
                } else if (createdAtB === null) {
                    return -1; // Place items without createdAt at the end
                }

                // Convert Firestore Timestamps to milliseconds
                const createdAtMillisA = createdAtA.toMillis();
                const createdAtMillisB = createdAtB.toMillis();

                // Sort based on createdAtMillis
                return createdAtMillisB - createdAtMillisA;
            });

            return newData;
        });
    }, []);
    //#endregion

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <View style={{ position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: theme.Primary, height: 48, zIndex: 3, }}></View>
            {headerTranslate !== -65 && <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />}
            <Animated.View style={{
                backgroundColor: theme.Primary,
                transform: [{ translateY: headerTranslate }],
                position: 'absolute',
                top: 40,
                right: 0,
                left: 0,
                zIndex: 2,
            }}>
                <MessageMainHeader excludedUsers={excludedUsers} userData={userData} theme={theme} opacity={opacity} />
            </Animated.View>
            <Animated.View style={{
                backgroundColor: theme.Primary,
                transform: [{ translateY: searchBarTranslate }],
                position: 'absolute',
                top: 80,
                right: 0,
                left: 0,
                zIndex: 1,
            }}>
                <SearchBar
                    disabled={loading === null}
                    placeholder={t('screens.messages.searchPlaceHolder')}
                    onChangeText={handleSearch}
                    onPressIn={loading === null ? null : handleSearchBarClick}
                    value={searchQuery}
                    platform="ios"
                    containerStyle={[SearchScreenStyles.searchBarContainer, { backgroundColor: theme.Primary, }]}
                    inputContainerStyle={[
                        SearchScreenStyles.searchBarInputContainer,
                        searchMode && SearchScreenStyles.searchBarInputContainerTop,
                        { backgroundColor: theme.SubPrimary, opacity: opacitySearchBar }
                    ]}
                    rightIconContainerStyle={{ opacity: RightIconContainerStyle }}
                    inputStyle={[
                        SearchScreenStyles.searchBarInput,
                        {
                            textAlign: "left",
                            color: theme.textQuaternary,
                            borderColor: theme.SubPrimary,
                            backgroundColor: theme.SubPrimary
                        },
                    ]}
                    clearIcon={{ type: "ionicon", name: "close-circle" }}
                    onClear={handleClear}
                    cancelButtonProps={{
                        style: { paddingRight: 10, },
                        onPress: handleCancel,
                    }}
                    keyboardAppearance={"default"}
                    searchIcon={{ type: "ionicon", name: "search" }}
                    cancelButtonTitle={t('screens.messages.searchCancel')}
                />

            </Animated.View>

            <View>
                {searchMode ? (
                    <Animated.ScrollView
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        onScrollEndDrag={onScrollEndDrag}
                        style={{ paddingTop: 100, paddingBottom: 150 }}>
                        {shouldDisplaySearchedItems ? searchedItems.map((item, index) => (
                            <TouchableOpacity style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToMessages(item) }}>
                                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                    <Image source={{ uri: item.profile_picture, cache: "force-cache", }}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 50,
                                            margin: 7,
                                            borderWidth: 1.5,
                                            borderColor: theme.Secondary
                                        }}
                                        placeholder={blurHash}
                                        contentFit="cover"
                                        transition={50}
                                        cachePolicy={"memory-disk"} />
                                </View>
                                <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                    <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                    {item.displayed_name ? <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text> : <Text style={{ color: colorPalette.dark.textSecondary, fontSize: 13, fontWeight: "500" }}>{t('screens.messages.defaultMessage')}</Text>}
                                </View>
                            </TouchableOpacity>
                        )) : null}
                    </Animated.ScrollView>
                ) : (
                    <MessageMainList usersForMessaging={usersForMessaging}
                        scrollY={scrollY}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        onScrollEndDrag={onScrollEndDrag}
                        loading={loading}
                        theme={theme} t={t}
                        userData={userData} sortedData={sortedData}
                        updateLastMessage={updateLastMessage} flag={"FromMain"} />
                )}
            </View>
        </SafeAreaView>
    )
}

export const SearchScreenStyles = StyleSheet.create({
    searchBarContainer: {
        paddingHorizontal: moderateScale(10),
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    searchBarInputContainer: {
        height: 40,
        borderRadius: 10
    },
    searchBarInputContainerTop: {
        justifyContent: "flex-start",
        alignContent: "flex-start",
        zIndex: 1,
    },
    searchBarInput: {
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderWidth: 0.5,
    },
})
export default MessagingMainScreen