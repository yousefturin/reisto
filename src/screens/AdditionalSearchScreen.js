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




import { SafeAreaView, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import initializeScalingUtils from '../utils/NormalizeSize';
import { useTheme } from '../context/ThemeContext';
import UseCustomTheme from '../utils/UseCustomTheme';
import { colorPalette } from '../Config/Theme';
import { SearchBar } from 'react-native-elements';
import { db, firebase } from '../firebase'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';
import { UserContext } from '../context/UserDataProvider';

const { moderateScale } = initializeScalingUtils(Dimensions);


// TODO: Improve the search query to be more flexible and search for more than one word.
const AdditionalSearchScreen = ({ route }) => {
    const navigation = useNavigation();
    const { searchQuery } = route.params;
    const { t } = useTranslation();
    const [searchResult, setSearchResult] = React.useState([]);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const userData = useContext(UserContext);


    const handleSearchBarClick = () => {
        navigation.navigate('Search', { shouldKeyboardOpen: true });
    }
    useEffect(() => {
        console.log("Subscribed to search Query.");
        // Function to fetch user saved posts and return subscription object
        const subscription = fetchDataOfSearchQuery(searchQuery);

        // Return cleanup function to unsubscribe when component unmounts or when dependencies change
        return () => {
            console.log("Unsubscribed from Query.");
            // Check if subscription object contains an unsubscribe function
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, [searchQuery])
    const fetchDataOfSearchQuery = async (searchQuery) => {
        try {
            //TODO: Need to store the caption in small and upper case to enhance search and make it wider.
            const user = firebase.auth().currentUser;
            if (user) {
                const querySnapshot = query(collectionGroup(db, 'posts'), where
                    ('category', '>=', `${searchQuery}`), where
                    ('category', '<=', `${searchQuery}+"\uf8ff"`));
                const querySnapshotAwait = await getDocs(querySnapshot);
                if (querySnapshotAwait.empty) {
                    console.log("No matching documents found.");
                    return [];
                }
                const results = [];
                querySnapshotAwait.forEach((doc) => {
                    const data = doc.data();
                    results.push({id: doc.id, ...data});
                });
                return setSearchResult(results);
            } else {
                console.error("No authenticated user found.");
                return () => { };
            }
        } catch (error) {
            console.log("Error getting documents: ", error);
            return () => { };
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary, justifyContent: "flex-start" }}>
            <View style={{
                backgroundColor: theme.Primary,
                position: 'absolute',
                top: 40,
                right: 0,
                left: 0,
                zIndex: 1,
            }}>
                <SearchBar
                    placeholder={t('screens.messages.searchPlaceHolder') + "..."}
                    onPressIn={handleSearchBarClick}
                    value={searchQuery}
                    platform="ios"
                    containerStyle={[SearchScreenStyles.searchBarContainer, { backgroundColor: theme.Primary, }]}
                    inputContainerStyle={[
                        SearchScreenStyles.searchBarInputContainer,
                        SearchScreenStyles.searchBarInputContainerTop, // when searchMode is true
                        { backgroundColor: theme.SubPrimary, }
                    ]}
                    inputStyle={[
                        SearchScreenStyles.searchBarInput,
                        {
                            textAlign: "left",
                            color: theme.textQuaternary,
                            borderColor: theme.SubPrimary,
                            backgroundColor: theme.SubPrimary
                        },
                    ]}
                    showCancel={false}
                    clearIcon={{ type: null, name: null }}
                    searchIcon={{ type: "ionicon", name: "search" }}
                />
                <SavedPostsGrid
                    fromWhere={"AdditionalSearchScreen"}
                    fromWhereValue={0}
                    posts={searchResult}
                    userData={userData}
                    navigateToScreen={"SearchExplore"}
                    searchQuery={searchQuery}
                    // onRefresh={onRefresh} refreshing={refreshing}
                />
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
export default AdditionalSearchScreen