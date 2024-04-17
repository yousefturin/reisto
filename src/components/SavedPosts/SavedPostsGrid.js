
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
            navigation.navigate('ShareExplorePostTimeLine', {
                userData, scrollToPostId: postId
            });
        }
    }
    // const [loaded, setLoaded] = useState(false);
    // const opacity = useRef(new Animated.Value(0)).current;
    // // since there is no server to handle each image hash, then an animation is create 
    // // to remove the flash when loading images and using this it will load all images together.
    // const onLoad = () => {
    //     Animated.timing(opacity, {
    //         toValue: 1,
    //         duration: 10, // Adjust the duration as needed
    //         useNativeDriver: true,
    //     }).start();
    //     setLoaded(true);
    // };
    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
            <Image
                source={{ uri: item.imageURL, cache: "force-cache" }}
                style={[styles.image]}
                // placeholder={blurHash}
                contentFit="cover"
                cachePolicy={"memory-disk"}
                recyclingKey={item.imageURL}
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