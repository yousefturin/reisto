import { Dimensions, SafeAreaView, StyleSheet, Text, Keyboard } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import MessageMainHeader from '../components/Message/MessageMainHeader'
import { UserContext } from '../context/UserDataProvider'
import { db } from '../firebase'
import MessageMainList from '../components/Message/MessageMainList'
import { View } from 'moti'
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

const { moderateScale } = initializeScalingUtils(Dimensions);

const MessagingMainScreen = () => {
    const { t } = useTranslation();

    const userData = useContext(UserContext);
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [excludedUsers, setExcludedUsers] = useState([])
    const [sortedData, setSortedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

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
        setClearedManually(true);
    }
    //#endregion

    useLayoutEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Initialize sorted data
        setSortedData([...usersForMessaging]);
    }, [usersForMessaging]);

    //#region Fetch data of users for messaging
    const fetchData = async () => {
        try {
            // search the messages based on the current user id and fetch those messages
            const messagesQuery1 = db.collection('messages')
                .where('owner1', '==', userData.email);
            const messagesQuery2 = db.collection('messages')
                .where('owner2', '==', userData.email);

            // Subscribe to the query snapshot to receive real-time updates
            const unsubscribe = messagesQuery1.onSnapshot((snapshot1) => {
                messagesQuery2.onSnapshot((snapshot2) => {
                    // Set to store unique matching private messages
                    const uniquePrivateMessages = new Set();

                    // Iterate through the messages to obtain the email id linked to users collection
                    snapshot1.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== userData.email) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== userData.email) {
                            uniquePrivateMessages.add(owner2);
                        }
                    });

                    snapshot2.forEach((messageDoc) => {
                        const owner1 = messageDoc.data().owner1;
                        const owner2 = messageDoc.data().owner2;

                        if (owner1 !== userData.email) {
                            uniquePrivateMessages.add(owner1);
                        }
                        if (owner2 !== userData.email) {
                            uniquePrivateMessages.add(owner2);
                        }
                    });

                    // Convert the Set back to an array
                    const matchingPrivateMessages = Array.from(uniquePrivateMessages);

                    // map users data to the matchingPrivateMessages array
                    const fetchPromises = matchingPrivateMessages.map(userId =>
                        db.collection('users').doc(userId).get()
                    );

                    Promise.all(fetchPromises)
                        .then((userDocs) => {
                            // map the user data to the userDocs array
                            const userDataDb = userDocs.map(userDoc => userDoc.data());

                            // set the excluded users to the matchingPrivateMessages array
                            setExcludedUsers(matchingPrivateMessages);

                            // set the users data to the state
                            if (userDataDb.length === 0) {
                                setLoading(null);
                            } else {
                                setLoading(false);
                                setUsersForMessaging(userDataDb);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching user data:", error);
                        });
                });
            });

            // Return the unsubscribe function to stop listening for updates
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    //#endregion

    //#region Update last message
    const updateLastMessage = useCallback((userId, message) => {
        // this was moved from the MainMessageList.js to here to make the 
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
                    placeholder={t('screens.messages.searchPlaceHolder') + "..."}
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
        shadowOffset: {
            width: 0,
            height: 2.2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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