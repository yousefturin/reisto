import { Dimensions, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SearchBar } from 'react-native-elements'
import { StyleSheet } from 'react-native'
import initializeScalingUtils from '../../utils/NormalizeSize'
const { moderateScale } = initializeScalingUtils(Dimensions);

const MessageMainSearchBar = ({ RightIconContainerStyle,
    setRightIconContainerStyle,
    usersForMessaging,
    setSearchedItems,
    setSearchMode,
    searchMode,
    setClearedManually,
    searchQuery,
    setSearchQuery
}) => {
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
    return (
        <SearchBar
            placeholder={"Search..."}
            onChangeText={handleSearch}
            onPressIn={handleSearchBarClick}
            value={searchQuery}
            platform="ios"
            containerStyle={SearchScreenStyles.searchBarContainer}
            inputContainerStyle={[
                SearchScreenStyles.searchBarInputContainer,
                searchMode && SearchScreenStyles.searchBarInputContainerTop, // when searchMode is true
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
    )
}
const SearchScreenStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#050505",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: moderateScale(88),
    },
    searchBarContainer: {
        paddingHorizontal: moderateScale(10),
        backgroundColor: "#050505",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    searchBarInputContainer: {
        backgroundColor: "#1C1C1E",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2.2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        height: 40,

    },
    searchBarInputContainerTop: {
        justifyContent: "flex-start",
        alignContent: "flex-start",
        zIndex: 1,
    },
    searchBarInput: {
        backgroundColor: "#1C1C1E",
        color: "#dddddd",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderWidth: 0.5,
        borderColor: "#1C1C1E"
    },
})
export default MessageMainSearchBar