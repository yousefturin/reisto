import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, SafeAreaView, Keyboard, TouchableOpacity } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import MessageMainList from '../components/Message/MessageMainList';
import { Divider, SearchBar } from 'react-native-elements';
import { SearchScreenStyles } from './MessagingMainScreen';
import { Image } from 'expo-image';
import { blurHash } from '../../assets/HashBlurData';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import { Animated } from 'react-native';



const MessagingNewForFollowersAndFollowingScreen = ({ route }) => {
    // the users that the current user did start a chat will be excluded from the list of users that the user can start a chat with.
    const { userData, excludedUsers } = route.params;
    const { t } = useTranslation();
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    useLayoutEffect(() => {
        fetchData();
    }, []);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(userData.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = [];
                const fetchPromisesSecond = [];

                for (const follower of data.followers) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];

                const uniqueUserIds = new Set();
                const filteredUsersData = allUsersData.filter(user => {
                    if (uniqueUserIds.has(user.owner_uid) || excludedUsers.includes(user.email)) {
                        return false;
                    } else {
                        uniqueUserIds.add(user.owner_uid);
                        return true;
                    }
                });
                if (filteredUsersData.length === 0) {
                    setLoading(null);
                } else {
                    setLoading(false);
                    setUsersForMessaging(filteredUsersData);
                }
            } else {
                console.log("No document found in the collection.");
                setLoading(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    //#region search 
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
        setClearedManually(true); // Set clearedManually flag to true when clearing manually
    }
    //#endregion

    //#region  animated header
    const scrollY = new Animated.Value(0);
    const offsetAnimation = new Animated.Value(0);
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnimation,
        ),
        0,
        65,
    );
    const clampedScrollSecond = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnimation,
        ),
        0,
        120,
    );
    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff, 0),
                65,
            );
        })
        offsetAnimation.addListener(({ value }) => {
            _offsetValue = value;
        });
    }, [])
    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, 65],
        outputRange: [0, -65],
        extrapolate: 'clamp',
    });
    const searchBarTranslate = clampedScrollSecond.interpolate({
        inputRange: [0, 120],
        outputRange: [0, -120],
        extrapolate: 'clamp',
    });

    const opacity = clampedScroll.interpolate({
        inputRange: [0, 40, 65],
        outputRange: [1, 0.3, 0],
        extrapolate: 'clamp',
    });
    const opacitySearchBar = clampedScroll.interpolate({
        inputRange: [0, 40, 80],
        outputRange: [1, 0.6, 0],
        extrapolate: 'clamp',
    });
    var scrollEndTimer = null
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > 65 && _clampedScrollValue > 65 / 2 ? _offsetValue + 65 : _offsetValue - 60;
        Animated.timing(offsetAnimation, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd, 250)
    }
    //#endregion

    const headerTitle = t('screens.messages.headerTitle');
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
                <EditProfileHeader opacity={opacity} headerTitle={headerTitle} navigation={navigation} theme={theme} />
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
                    placeholder={t('screens.messages.searchPlaceHolder') + "..."}
                    onChangeText={handleSearch}
                    // had to do this since even the search is disabled, the onPressIn event is still triggered
                    onPressIn={loading === null ? null : handleSearchBarClick}
                    value={searchQuery}
                    platform="ios"
                    containerStyle={[SearchScreenStyles.searchBarContainer, { backgroundColor: theme.Primary, }]} inputContainerStyle={[
                        SearchScreenStyles.searchBarInputContainer,
                        searchMode && SearchScreenStyles.searchBarInputContainerTop, // when searchMode is true
                        { backgroundColor: theme.SubPrimary, opacity: opacitySearchBar }
                    ]}
                    rightIconContainerStyle={{ opacity: RightIconContainerStyle }}
                    inputStyle={[
                        SearchScreenStyles.searchBarInput,
                        {
                            textAlign: "left",
                            borderColor: theme.SubPrimary,
                            backgroundColor: theme.SubPrimary
                        },
                    ]}
                    clearIcon={{ type: "ionicon", name: "close-circle" }}
                    onClear={handleClear}
                    cancelButtonProps={{
                        style: { paddingRight: 10 },
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
                        style={{ paddingTop: 100, paddingBottom: 50 }}>
                        {shouldDisplaySearchedItems ? (
                            searchedItems.map((item, index) => (
                                <TouchableOpacity style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToMessages(item) }}>
                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                        <Image source={{ uri: item.profile_picture, cache: "force-cache", }}
                                            style={{
                                                width: 50,
                                                height: 50,
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
                                        {item.displayed_name ? <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text> : <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{t('screens.messages.defaultMessage')}</Text>}
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : null}
                    </Animated.ScrollView>
                ) : (
                    <MessageMainList
                        scrollY={scrollY}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        onScrollEndDrag={onScrollEndDrag}
                        loading={loading} usersForMessaging={usersForMessaging}
                        userData={userData} flag={"FromNewMessage"}
                        theme={theme} t={t} />
                )}
            </View>
        </SafeAreaView>
    );
};

export default MessagingNewForFollowersAndFollowingScreen;