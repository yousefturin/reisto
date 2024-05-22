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


// need work on this screen, but the logic is correct and optimized
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
            const user = firebase.auth().currentUser;
            if (user) {
                const querySnapshot = query(collectionGroup(db, 'posts'), where
                    ('caption', '==', `${searchQuery}`));
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
                // console.log(results);
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
                    // rightIconContainerStyle={{ opacity: RightIconContainerStyle }}
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