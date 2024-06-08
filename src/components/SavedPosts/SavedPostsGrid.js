/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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
        // console.log("scrollToIndex", scrollToIndex)
        
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

    //  coming from search
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

        // any place else
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


