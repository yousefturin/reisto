/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, View, Text } from 'react-native';
import React, { useCallback } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Image } from 'expo-image';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;

// OwnerProfilePostScreen will be move inside here, and then based on a state it will be displayed and removed over the screen
// to keep the data re-rendered since passing the data using routs will make the data as cashed data

const ProfilePost = ({ posts, userData, keyValue, userDataToBeNavigated, justSeenPost }) => {
    const navigation = useNavigation();
    // console.log("justSeenPost", justSeenPost)

    const handleNavigationToPost = (postId) => {
        let scrollToIndex
        justSeenPost = null
        if (posts.length > 0) {
            const index = posts.findIndex(post => post.id === postId);
            if (index !== -1) {
                scrollToIndex = index;
            }
        }

        if (keyValue === "NavigationToMyProfile") {
            navigation.navigate('UserProfilePost', {
                userData, scrollToPostId: scrollToIndex,
            });
        } else if (keyValue === "NavigationToOtherProfile") {
            navigation.navigate('OthersProfilePost', {
                userDataToBeNavigated, scrollToPostId: scrollToIndex,
            });
        }
    }

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity disabled={item.empty === true} style={styles.listContainer} activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
                <View style={styles.imageContainer}>
                    {justSeenPost === item.id && justSeenPost !== null && justSeenPost !== undefined ? (
                        <View style={{ position: "relative", }}>
                            <Image
                                source={{ uri: item.imageURL, cache: "force-cache" }}
                                style={[styles.image, { zIndex: 10, opacity: 0.3 }]}
                                contentFit="cover"
                                cachePolicy={"memory-disk"}
                                recyclingKey={item.imageURL}
                                transition={50}
                            />
                            <Text style={{ position: "absolute", alignSelf: "center", top: "50%", color: "#fff", zIndex: 12, fontWeight: "500", fontSize: 12, margin: -0.3 }}>
                                Just seen</Text>
                        </View>
                    ) : (
                        <Image
                            source={{ uri: item.imageURL, cache: "force-cache" }}
                            style={styles.image}
                            contentFit="cover"
                            cachePolicy={"memory-disk"}
                            recyclingKey={item.imageURL}
                            transition={50}
                        />)}

                </View>

            </TouchableOpacity>
        ),
        [posts]
    )

    const keyExtractor = (item, index) => {
        if (item.id !== undefined && item.id !== null) {
            return item.id.toString();
        }
        return index.toString();
    };

    const formatData = (data, numColumns) => {
        // Create a copy of the data array to avoid mutating the original array------------------------------ this shit made me scared a data updated in child
        // will be return to parent and another child will use this data from this child! OMG react really!
        const dataCopy = [...data];

        const numberOfFullRows = Math.floor(dataCopy.length / numColumns);
        let numberOfElementsLastRow = dataCopy.length - (numberOfFullRows * numColumns);

        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            dataCopy.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }

        return dataCopy;
    };

    return (
        <>
            <FlatList
                style={{ paddingTop: 25, paddingBottom: 50 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                data={formatData(posts, columnCount)}
                nestedScrollEnabled={true}
                scrollEnabled={false}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                contentContainerStyle={styles.container}
            />
        </>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        margin: 0.3,
        overflow: 'hidden',
    },
    imageContainer: {
        flex: 1,
        margin: 0.3,
        overflow: 'hidden',
    },
    image: {
        width: (screenWidth + 4 - (columnCount)) / 3,
        height: (screenWidth + 4 - (columnCount)) / 3,
    },
});
export default ProfilePost