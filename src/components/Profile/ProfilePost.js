
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Image } from 'expo-image';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;

// OwnerProfilePostScreen will be move inside here, and then based on a state it will be displayed and removed over the screen
// to keep the data re-rendered since passing the data using routs will make the data as cashed data

const ProfilePost = ({ posts, userData, keyValue, userDataToBeNavigated }) => {
    const navigation = useNavigation();
    const handleNavigationToPost = (postId) => {
        if (keyValue === "NavigationToMyProfile") {
            navigation.navigate('UserProfilePost', {
                userData, scrollToPostId: postId,
            });
        } else if (keyValue === "NavigationToOtherProfile") {
            navigation.navigate('OthersProfilePost', {
                userDataToBeNavigated, scrollToPostId: postId,
            });
        }
    }
    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity style={styles.listContainer} activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.imageURL, cache: "force-cache" }}
                        style={styles.image}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                        recyclingKey={item.imageURL}
                        transition={50}
                    />
                </View>

            </TouchableOpacity>
        ),
        []
    )
    const keyExtractor = (item, index) => {
        if (item.id !== undefined && item.id !== null) {
            return item.id.toString();
        }
        return index.toString();
    };

    return (
        <>
            {/* <View style={{ justifyContent: "space-around", alignItems: "center", paddingTop: 20, paddingHorizontal: 20, flexDirection: "row", }}>
            </View> */}
            <FlatList
                style={{ paddingTop: 25, paddingBottom: 150 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                data={posts}
                nestedScrollEnabled={true}
                scrollEnabled={false}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={columnCount}
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