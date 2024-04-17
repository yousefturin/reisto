
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import initializeScalingUtils from '../../utils/NormalizeSize';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;
const gapSize = 1;

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
        <>
            <View style={{ justifyContent: "space-around", alignItems: "center", paddingTop: 20, paddingHorizontal: 20, flexDirection: "row" }}>
            </View>

            <FlatList
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
export default ProfilePost