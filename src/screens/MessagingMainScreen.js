import { Dimensions, SafeAreaView, StyleSheet, Text, Keyboard } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import MessageMainHeader from '../components/Message/MessageMainHeader'
import { UserContext } from '../context/UserDataProvider'
import { db } from '../firebase'
import MessageLoadingPlaceHolder from '../components/Message/MessageLoadingPlaceHolder'
import MessageMainList from '../components/Message/MessageMainList'
import MessageMainSearchBar from '../components/Message/MessageMainSearchBar'
import { View } from 'moti'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { blurHash } from '../../assets/HashBlurData'
import { SearchBar } from 'react-native-elements'
import initializeScalingUtils from '../utils/NormalizeSize'
import { useNavigation } from '@react-navigation/native'
import { colorPalette } from '../Config/Theme'
const { moderateScale } = initializeScalingUtils(Dimensions);

const MessagingMainScreen = () => {
    const userData = useContext(UserContext);
    const [usersForMessaging, setUsersForMessaging] = useState([]);
    const [excludedUsers, setExcludedUsers] = useState([])
    const [sortedData, setSortedData] = useState([]);
    const navigation = useNavigation();

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
                            setUsersForMessaging(userDataDb);
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.dark.Primary  }}>
            <MessageMainHeader excludedUsers={excludedUsers} userData={userData} />
            <SearchBar
                placeholder={"Search..."}
                onChangeText={handleSearch}
                onPressIn={handleSearchBarClick}
                value={searchQuery}
                platform="ios"
                containerStyle={SearchScreenStyles.searchBarContainer}
                inputContainerStyle={[
                    SearchScreenStyles.searchBarInputContainer,
                    searchMode && SearchScreenStyles.searchBarInputContainerTop,
                ]}
                rightIconContainerStyle={{ opacity: RightIconContainerStyle }}
                inputStyle={[
                    SearchScreenStyles.searchBarInput,
                    { textAlign: "left" },
                ]}
                clearIcon={{ type: "ionicon", name: "close-circle" }}
                onClear={handleClear}
                cancelButtonProps={{
                    style: { paddingRight: 10 },
                    onPress: handleCancel,
                }}
                keyboardAppearance={"default"}
                searchIcon={{ type: "ionicon", name: "search" }}
                cancelButtonTitle={"Cancel"}
            />
            <View>
                {searchMode ? (
                    <>
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
                                            borderColor: colorPalette.dark.Secondary
                                        }}
                                        placeholder={blurHash}
                                        contentFit="cover"
                                        transition={50}
                                        cachePolicy={"memory-disk"} />
                                </View>

                                <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                    <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                    {item.displayed_name ? <Text style={{ color: colorPalette.dark.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text> : <Text style={{ color: colorPalette.dark.textSecondary, fontSize: 13, fontWeight: "500" }}>Say Hi 👋</Text>}
                                </View>
                            </TouchableOpacity>
                        )) : null}
                    </>
                ) : (
                    <MessageMainList usersForMessaging={usersForMessaging}
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
        backgroundColor: colorPalette.dark.Primary,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    searchBarInputContainer: {
        backgroundColor: colorPalette.dark.Quinary,
        shadowColor: "black",
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
        backgroundColor:colorPalette.dark.Quinary,
        color: colorPalette.dark.textQuaternary,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderWidth: 0.5,
        borderColor: colorPalette.dark.Quinary,
    },
})
export default MessagingMainScreen