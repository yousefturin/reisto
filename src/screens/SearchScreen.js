import { Dimensions, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SearchBar } from "react-native-elements";
import initializeScalingUtils from '../utils/NormalizeSize';
import { db, firebase } from '../firebase';
import { blurHash } from '../../assets/HashBlurData';
import { Image } from 'expo-image';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';
import { UserContext } from '../context/UserDataProvider';
import { useNavigation } from '@react-navigation/native';
const { moderateScale } = initializeScalingUtils(Dimensions);
import AsyncStorage from "@react-native-async-storage/async-storage";
import SvgComponent from '../utils/SvgComponents';
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';

const SearchScreen = () => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [RightIconContainerStyle, setRightIconContainerStyle] = useState(1);
    const [clearedManually, setClearedManually] = useState(true); // Add a state to track if search query was cleared manually
    const userData = useContext(UserContext);
    const [posts, setPosts] = useState([])
    const navigation = useNavigation();
    const [clickedUsers, setClickedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })



    // Determine whether to display searchedItems based on searchQuery and clearedManually flag
    const shouldDisplaySearchedItems = searchQuery !== "" || !clearedManually;

    const handleNavigationToProfile = (item) => {
        let userDataToBeNavigated = item
        saveClickedUser(userDataToBeNavigated);
        navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated });
    }

    const saveClickedUser = async (user) => {
        try {
            let clickedUsersList = await AsyncStorage.getItem('clickedUsers');
            clickedUsersList = clickedUsersList ? JSON.parse(clickedUsersList) : [];

            // Check if user already exists in the list
            const isUserExist = clickedUsersList.some((clickedUser) => clickedUser.id === user.id);

            if (!isUserExist) {
                clickedUsersList.push(user);
                await AsyncStorage.setItem('clickedUsers', JSON.stringify(clickedUsersList));
                setClickedUsers(clickedUsersList); // Update state with the new list
            }
        } catch (error) {
            console.error('Error saving clicked user:', error);
        }
    };
    const handleRemoveFromAsync = async (item) => {
        try {
            let clickedUsersList = await AsyncStorage.getItem('clickedUsers');
            clickedUsersList = clickedUsersList ? JSON.parse(clickedUsersList) : [];

            // Filter out the item to be removed
            const updatedList = clickedUsersList.filter((clickedUser) => clickedUser.id !== item.id);

            // Update AsyncStorage and state
            await AsyncStorage.setItem('clickedUsers', JSON.stringify(updatedList));
            setClickedUsers(updatedList);
        } catch (error) {
            console.error('Error removing clicked user:', error);
        }
    };

    // Function to load clicked users from AsyncStorage
    const loadClickedUsers = async () => {
        try {
            const clickedUsersList = await AsyncStorage.getItem('clickedUsers');
            if (clickedUsersList) {
                setClickedUsers(JSON.parse(clickedUsersList));
            }
        } catch (error) {
            console.error('Error loading clicked users:', error);
        }
    };

    useEffect(() => {
        loadClickedUsers();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            db.collection('users').get().then(querySnapshot => {
                const allPosts = [];
                querySnapshot.forEach(doc => {
                    // Check if the current document's user ID "email" matches the current user's ID "email".
                    if (doc.id !== user.email) {
                        allPosts.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    }
                });
                setItems(allPosts);
            });
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        setRightIconContainerStyle(1);
        const normalizedQuery = query.toLowerCase().replace(/[أإِ]/g, "ا");

        // Filter items based on the normalized search query and normalized item names
        const filtered = items.filter((item) => {
            const normalizedItemName = item.username.toLowerCase().replace(/[أإِ]/g, "ا");
            return normalizedItemName.includes(normalizedQuery);
        });

        setSearchedItems(filtered);
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

    const handleSearchBarClick = () => {
        setSearchMode(true);
    };



    useEffect(() => {
        let unsubscribe;
        // this is only for testing the UI,UX and it will be changed for random posts to be displayedF
        const fetchPost = () => {
            const query = db.collectionGroup('posts').orderBy('createdAt', 'desc');
            // get the id of each post, and destructure the posts then order them based on createdAt as desc
            unsubscribe = query.onSnapshot(snapshot => {
                const postsWithProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    if (dbPostData.length === 0) { setLoading(null); return; }
                    try {
                        const userDoc = await db.collection('users').doc(dbPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbProfilePicture, // this is work the picture is from the current logged in user not the one that is mapped to the post!
                            ...dbPostData
                        }
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        return {
                            id: post.id,
                            ...dbPostData // Fallback to original post data if user document fetch fails
                        }
                    }
                })
                Promise.all(postsWithProfilePictures).then(posts => {
                    setPosts(posts)
                    setLoading(false)
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            });
        };
        fetchPost()
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);




    return (
        // this must be on a scrollView-<<<<<<<<<<<<<<<<
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary, justifyContent: "flex-start" }}>
            <SearchBar
                placeholder={t('screens.messages.searchPlaceHolder') + "..."}
                onChangeText={handleSearch}
                onPressIn={handleSearchBarClick}
                value={searchQuery}
                platform="ios"
                containerStyle={[SearchScreenStyles.searchBarContainer, { backgroundColor: theme.Primary, }]}
                inputContainerStyle={[
                    SearchScreenStyles.searchBarInputContainer,
                    searchMode && SearchScreenStyles.searchBarInputContainerTop, // when searchMode is true
                    { backgroundColor: theme.SubPrimary, }
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
                    style: { paddingRight: 10 },
                    onPress: handleCancel,
                }}
                keyboardAppearance={"default"}
                searchIcon={{ type: "ionicon", name: "search" }}
                cancelButtonTitle={t('screens.messages.searchCancel')}

            />
            <View>
                {searchMode ? (
                    <>
                        {shouldDisplaySearchedItems ? searchedItems.map((item, index) => (
                            <TouchableOpacity style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToProfile(item) }}>
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
                                    <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )) : (
                            clickedUsers.map((item, index) => (
                                <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToProfile(item) }}>
                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                        <Image source={{ uri: item.profile_picture, cache: "force-cache" }}
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

                                    <View style={{ flexDirection: "column", width: "70%", justifyContent: "center", alignItems: "flex-start" }}>
                                        <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
                                    </View>
                                    <TouchableOpacity style={{ width: "10%", justifyContent: "center", alignItems: "center" }} onPress={() => handleRemoveFromAsync(item)}>
                                        <SvgComponent svgKey="CloseSVG" width={moderateScale(16)} height={moderateScale(16)} stroke={theme.textSecondary} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))
                        )}
                    </>

                ) : (
                    <>
                        {loading === false ? (
                            <SavedPostsGrid posts={posts} userData={userData} navigateToScreen={"SearchExplore"} />
                        ) : loading === null ? (
                            <View style={{ minHeight: 800 }}>
                                <EmptyDataParma SvgElement={"BookmarkIllustration"} theme={theme} t={t} dataMessage={"You can save posts across Reisto and organize them into collections."} TitleDataMessage={"Nothing saved yet"} />
                            </View>
                        ) : (
                            <LoadingPlaceHolder condition={loading === false} theme={theme} />
                        )}

                    </>
                )
                }
            </View>
        </SafeAreaView>
    )
}


const SearchScreenStyles = StyleSheet.create({
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
export default SearchScreen