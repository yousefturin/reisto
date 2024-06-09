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




import { FlatList, StyleSheet, Dimensions, TouchableOpacity, Animated, View, RefreshControl } from 'react-native';
import React, { useCallback } from 'react'
import { Image } from 'expo-image';
import { useNavigation } from "@react-navigation/native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;



const SavedPostsGrid = ({
    searchQuery,
    fromWhere,
    fromWhereValue,
    posts, userData,
    navigateToScreen, onRefresh,
    refreshing,
    scrollY,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScrollEndDrag }) => {

    const navigation = useNavigation();
    const searchParams = fromWhere === "AdditionalSearchScreen" ? searchQuery : null

    const handleNavigationToPost = (postId) => {
        let scrollToIndex 
        if (posts.length > 0) {
            const index = posts.findIndex(post => post.id === postId);
            if (index !== -1) {
                scrollToIndex = index;
            }
        }

        
        if (navigateToScreen === "SavedPosts") {
            navigation.navigate('UserSavedPostTimeLine', {
                userData, scrollToPostId: scrollToIndex
            });
        } else if (navigateToScreen === "SearchExplore") {
            navigation.navigate('SearchExplorePostTimeLine', {
                userData, scrollToPostId: scrollToIndex, fromWhere: fromWhere, searchQuery: searchParams
            });
        }
    }

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity disabled={item.empty === true} style={styles.listContainer} activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
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
        [posts]
    )


    const keyExtractor = (item, index) => {
        if (item.id !== undefined && item.id !== null) {
            return item.id.toString();
        }
        return index.toString();
    };

    const formatData = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }
        return data;
    }

    // Handle search display when coming from search
    if (fromWhereValue !== 0) {
        return (
            <AnimatedFlatList
                style={{ paddingTop: fromWhereValue }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                data={formatData(posts, columnCount)}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={columnCount}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onScrollEndDrag}
                scrollEventThrottle={4}
                contentContainerStyle={{ paddingBottom: 60 }}
            />
        )

    // Handle search display from any place else
    } else {
        return (
            <FlatList
                style={{ paddingTop: fromWhereValue }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                data={formatData(posts, columnCount)}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={columnCount}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: (screenWidth + 4 - (columnCount)) / 3 }}
            />
        )
    }
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
export default SavedPostsGrid


