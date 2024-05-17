
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, Animated, View, RefreshControl } from 'react-native';
import React, { useCallback } from 'react'
import { Image } from 'expo-image';

import { useNavigation } from "@react-navigation/native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const screenWidth = Dimensions.get('window').width;
const columnCount = 3;



const SavedPostsGrid = ({
    fromWhereValue,
    posts, userData,
    navigateToScreen, onRefresh,
    refreshing,
    scrollY,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScrollEndDrag }) => {
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
    //  coming from search
    if (fromWhereValue !== 0) {
        return (
            <AnimatedFlatList
                style={{ paddingTop: fromWhereValue }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}
                data={posts}
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
                contentContainerStyle={{ paddingBottom: (screenWidth + 4 - (columnCount)) / 3 }}
            />
        )
        // any place else
    }else{
        return(
            <FlatList
                style={{ paddingTop: fromWhereValue }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                data={posts}
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