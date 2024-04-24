
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import React, { useRef, useState } from 'react'
import { Image } from 'expo-image';

import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;
const gapSize = 1;


const SavedPostsGrid = ({ posts, userData, navigateToScreen }) => {
    const navigation = useNavigation();
    const handleNavigationToPost = (postId) => {
        if (navigateToScreen === "SavedPosts") {
            navigation.navigate('UserSavedPostTimeLine', {
                userData, scrollToPostId: postId
            });
        } else if (navigateToScreen === "SearchExplore") {
            navigation.navigate('SearchExplorePostTimeLine', {
                userData, scrollToPostId: postId
            });
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
            <Image
                source={{ uri: item.imageURL, cache: "force-cache" }}
                style={[styles.image]}
                // placeholder={blurHash}
                contentFit="cover"
                cachePolicy={"memory-disk"}
                recyclingKey={item.imageURL}
                transition={50}
            // onLoad={onLoad}
            />
        </TouchableOpacity>
    );
    const keyExtractor = (item, index) => {
        if (item.id !== undefined && item.id !== null) {
            return item.id.toString();
        }
        return index.toString();
    };
    return (
        <FlatList
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
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingHorizontal: gapSize,
        paddingVertical: gapSize,
    },
    image: {
        width: (screenWidth - (columnCount + 1) * gapSize) / columnCount,
        height: (screenWidth - (columnCount + 1) * gapSize) / columnCount,
        margin: gapSize,
    },
});
export default SavedPostsGrid