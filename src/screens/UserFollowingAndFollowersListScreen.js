import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { blurHash } from '../../assets/HashBlurData';

const screenWidth = Dimensions.get('window').width;


const UserFollowingAndFollowersListScreen = ({ route }) => {
    const { userData, flag, paramFollowing, paramFollower } = route.params;
    const handleNavigationToOtherUserProfile = (item) => {
        const userDataToBeNavigated = {
            ...item, // Copy all properties from item
            id: item.email // Replace email with id
        };
        navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated });
    }
    const navigation = useNavigation();
    const [paramFlag, setParamFlag] = useState(flag);
    const [animatedValue] = useState(new Animated.Value(0));

    const handleDataSwitch = (param) => {
        if (param === "followers") {
            Animated.timing(animatedValue, {
                toValue: 0, // Move borderBottom to "followers"
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false // Set to true if possible for performance
            }).start();
            setParamFlag("followers");
        } else {
            Animated.timing(animatedValue, {
                toValue: 1, // Move borderBottom to "following"
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false // Set to true if possible for performance
            }).start();
            setParamFlag("following");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <EditProfileHeader headerTitle={userData.username} navigation={navigation} />
            <View style={{ flexDirection: "row", justifyContent: "space-around", position: "relative" }}>
                <TouchableOpacity
                    onPress={() => { handleDataSwitch("followers") }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: paramFlag === "followers" ? "#fff" : "#8E8E93", fontSize: 16, fontWeight: paramFlag === "followers" ? "700" : "500" }}>follower</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { handleDataSwitch("following") }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: paramFlag === "following" ? "#fff" : "#8E8E93", fontSize: 16, fontWeight: paramFlag === "following" ? "700" : "500" }}>following</Text>
                </TouchableOpacity>

                <Animated.View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: "20%",
                    height: 2,
                    backgroundColor: '#fff',
                    transform: [{
                        translateX: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [screenWidth / 7, screenWidth / 1.54]
                        })
                    }]
                }} />
            </View>

            <View>
                {paramFlag === "followers" ? (
                    <>
                        {paramFollower?.map((item, index) => (
                            <TouchableOpacity style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToOtherUserProfile(item) }}>
                                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                    <Image source={{ uri: item.profile_picture, cache: "force-cache", }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                            margin: 7,
                                            borderWidth: 1.5,
                                            borderColor: "#2b2b2b"
                                        }}
                                        placeholder={blurHash}
                                        contentFit="cover"
                                        transition={50}
                                        cachePolicy={"memory-disk"} />
                                </View>

                                <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                    <Text style={{ color: "#8E8E93", fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                ) : (
                    <>
                        {paramFollowing?.map((item, index) => (
                            <TouchableOpacity style={{ flexDirection: "row" }} key={index} onPress={() => { handleNavigationToOtherUserProfile(item) }}>
                                <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                                    <Image source={{ uri: item.profile_picture, cache: "force-cache", }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                            margin: 7,
                                            borderWidth: 1.5,
                                            borderColor: "#2b2b2b"
                                        }}
                                        placeholder={blurHash}
                                        contentFit="cover"
                                        transition={50}
                                        cachePolicy={"memory-disk"} />
                                </View>

                                <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                    <Text style={{ color: "#8E8E93", fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>)}

            </View>
        </SafeAreaView >
    );
};

export default UserFollowingAndFollowersListScreen;