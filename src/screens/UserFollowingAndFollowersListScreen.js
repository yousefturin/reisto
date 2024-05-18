import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { blurHash } from '../../assets/HashBlurData';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';

const screenWidth = Dimensions.get('window').width;


const UserFollowingAndFollowersListScreen = ({ route }) => {
    const { userData, flag, paramFollowing, paramFollower } = route.params;

    const { t } = useTranslation();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    const navigation = useNavigation();
    const [paramFlag, setParamFlag] = useState(flag);
    const [animatedValue] = useState(new Animated.Value(flag === "followers" ? 0 : 1));

    const handleNavigationToOtherUserProfile = (item) => {
        const userDataToBeNavigated = {
            ...item, // Copy all properties from item
            id: item.email // Replace email with id
        };
        navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated });
    }

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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <EditProfileHeader headerTitle={userData.username} navigation={navigation} theme={theme} />
            <View style={{ flexDirection: "row", justifyContent: "space-around", position: "relative" }}>
                <TouchableOpacity
                    onPress={() => { handleDataSwitch("followers") }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: paramFlag === "followers" ? theme.textPrimary : theme.textSecondary, fontSize: 16, fontWeight: paramFlag === "followers" ? "700" : "500" }}>{t('screens.profile.text.profileContent.followers')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { handleDataSwitch("following") }}
                    style={{ padding: 10 }}>
                    <Text style={{ color: paramFlag === "following" ? theme.textPrimary : theme.textSecondary, fontSize: 16, fontWeight: paramFlag === "following" ? "700" : "500" }}>{t('screens.profile.text.profileContent.following')}</Text>
                </TouchableOpacity>
                {
                    flag === 'followers' ? (
                        <Animated.View style={{
                            position: 'absolute',
                            bottom: -1,
                            left: 0,
                            width: "20%",
                            height: 2,
                            backgroundColor: theme.textPrimary,
                            transform: [{
                                translateX: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [screenWidth / 6.5, screenWidth / 1.54]
                                })
                            }]
                        }} />
                    ) : (
                        <Animated.View style={{
                            zIndex: 1,
                            position: 'absolute',
                            bottom: -1,
                            left: screenWidth / 2,
                            width: "20%",
                            height: 2,
                            backgroundColor: theme.textPrimary,
                            transform: [{
                                translateX: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-screenWidth / 2.9, screenWidth / 6.5]
                                })
                            }]
                        }} />
                    )
                }
            </View>
            {/* <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} style={{ zIndex: -1 }} /> */}
            <View>
                {paramFollowing.length === 0 && paramFollower.length === 0 ? 
                (paramFlag === "followers" ? (
                    <EmptyDataParma SvgElement={"ConnectionIllustration"} theme={theme} t={t} dataMessage={"Once people follow you, you'll see theme here."} TitleDataMessage={"People who follow you"} />
                ) : (
                    <EmptyDataParma SvgElement={"AddUserIllustration"} theme={theme} t={t} dataMessage={"Once you follow people, you'll see theme here."} TitleDataMessage={"People you follow"} />
                )) : (
                    paramFlag === "followers" ? (
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
                                                borderColor: theme.Secondary
                                            }}
                                            placeholder={blurHash}
                                            contentFit="cover"
                                            transition={50}
                                            cachePolicy={"memory-disk"} />
                                    </View>

                                    <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                        <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
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
                                                borderColor: theme.Secondary
                                            }}
                                            placeholder={blurHash}
                                            contentFit="cover"
                                            transition={50}
                                            cachePolicy={"memory-disk"} />
                                    </View>

                                    <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start", }}>
                                        <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16 }}>{item.username}</Text>
                                        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "500" }}>{item.displayed_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>)
                )}
            </View>
        </SafeAreaView>
    );
};

export default UserFollowingAndFollowersListScreen;


