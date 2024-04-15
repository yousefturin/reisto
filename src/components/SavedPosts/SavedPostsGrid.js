
import { FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react'
import { Image } from 'expo-image';

import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;
const gapSize = 1;


const SavedPostsGrid = ({ posts, userData }) => {
    const navigation = useNavigation();
    const handleNavigationToPost = (postId) => {
        navigation.navigate('UserSavedPostTimeLine', {
            userData, scrollToPostId: postId
        });
    }
    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
            <Image
                source={{ uri: item.imageURL, cache: "force-cache" }}
                style={styles.image}
                placeholder={blurHash}
                contentFit="cover"
                cachePolicy={"memory-disk"}
                recyclingKey={item.imageURL}
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
        height: (screenWidth - (columnCount + 1) * gapSize) / columnCount, // Assuming square images
        margin: gapSize,
    },
});
export default SavedPostsGrid