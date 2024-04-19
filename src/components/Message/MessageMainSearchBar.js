import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { SearchBar } from 'react-native-elements'
import { StyleSheet } from 'react-native'
import initializeScalingUtils from '../../utils/NormalizeSize'
const { moderateScale } = initializeScalingUtils(Dimensions);

const MessageMainSearchBar = ({RightIconContainerStyle}) => {
    return (
        <SearchBar
            placeholder={"Search..."}
            // onChangeText={handleSearch}
            // onPressIn={handleSearchBarClick}
            // value={searchQuery}
            platform="ios"
            containerStyle={SearchScreenStyles.searchBarContainer}
            inputContainerStyle={[
                SearchScreenStyles.searchBarInputContainer,
                // searchMode && SearchScreenStyles.searchBarInputContainerTop, // when searchMode is true
            ]}
            rightIconContainerStyle={{ opacity: RightIconContainerStyle }}
            inputStyle={[
                SearchScreenStyles.searchBarInput,
                { textAlign: "left" },
            ]}
            clearIcon={{ type: "ionicon", name: "close-circle" }}
            // onClear={handleClear}
            cancelButtonProps={{
                style: { paddingRight: 10 },
                // onPress: handleCancel,
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