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
import { FlatList, StyleSheet, Dimensions, TouchableOpacity, View, Text } from 'react-native';
import React, { useCallback } from 'react'
import { useNavigation } from "@react-navigation/native";
import { Image } from 'expo-image';
import ReactNativeModal from 'react-native-modal';
import initializeScalingUtils from '../../utils/NormalizeSize';
import * as Haptics from 'expo-haptics';
const screenWidth = Dimensions.get('window').width;
const columnCount = 3;

// OwnerProfilePostScreen will be move inside here, and then based on a state it will be displayed and removed over the screen
// to keep the data re-rendered since passing the data using routs will make the data as cashed data

const ProfilePost = ({ posts, userData, keyValue, userDataToBeNavigated, justSeenPost }) => {
    const navigation = useNavigation();

    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [clickedPostId, setClickedPostId] = React.useState(null);
    const handleNavigationToPost = (postId) => {
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
            <TouchableOpacity onLongPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                setClickedPostId(item);
                setIsModalVisible(true);
            }} disabled={item.empty === true} style={styles.listContainer} activeOpacity={0.8} onPress={() => handleNavigationToPost(item.id)}>
                <View style={styles.imageContainer}>
                    {justSeenPost === item.id && justSeenPost !== null && justSeenPost !== undefined ? (
                        <View style={{ position: "relative", }}>
                            <Image
                                source={{ uri: item.imageURL, cache: "force-cache" }}
                                style={[styles.image, {
                                    zIndex: 10, opacity: 0.3,
                                }]}
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
            {/* need to pass them to the parent component */}
            <ReactNativeModal
                isVisible={isModalVisible}
                onSwipeComplete={() => setIsModalVisible(false)}
                onBackdropPress={() => setIsModalVisible(false)}
                swipeDirection="down"
                swipeThreshold={170}
                animationIn={"zoomIn"}
                animationOut={"fadeOut"}
                animationInTiming={500}
                backdropOpacity={1}
                backdropColor='#353535'
                style={{
                    justifyContent: 'center',
                    margin: 0,
                    opacity: 1,
                    alignItems: 'center',
                }}>
                <View style={{
                    backgroundColor: "#262626",
                    height: 350,
                    width: 300,
                    borderRadius: 20,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 6,
                        alignItems: "center",
                        width: "100%",
                    }}>

                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={{ uri: userData.profile_picture, cache: "force-cache" }}
                                style={[{
                                    borderRadius: moderateScale(50), width: 35,
                                    height: 35,
                                    borderRadius: 50,
                                    marginLeft: 6,
                                    borderWidth: 1,
                                    borderColor: "#fff",
                                }]}
                                contentFit="cover"
                                transition={50}
                            />
                            <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>{userData.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Text style={{ color: "#fff", fontWeight: "900", marginBottom: 15, marginRight: 10 }}>...</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        handleNavigationToPost(clickedPostId.id)
                        setIsModalVisible(false);
                    }
                    } >
                        <Image
                            source={{ uri: clickedPostId?.imageURL, cache: "force-cache" }}
                            style={{ width: 300, height: 300, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, }}
                            contentFit="contain"
                            cachePolicy={"memory-disk"}
                            recyclingKey={clickedPostId?.imageURL}
                            transition={50}
                        />
                    </TouchableOpacity>
                </View>
            </ReactNativeModal>
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


