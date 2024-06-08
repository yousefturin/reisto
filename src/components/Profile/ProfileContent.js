/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { View, Text, TouchableOpacity, Dimensions, Modal, Animated } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { extractDomain } from '../../utils/ExtractDomainFromLink';
import { WebView } from 'react-native-webview';
import { Divider } from 'react-native-elements';
import useCurrentUserFollowing from '../../hooks/useCurrentUserFollowing';

const ProfileContent = ({ userData, userPosts, theme, t, opacityContent }) => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const { followersData, followingData, followersAndFollowing } = useCurrentUserFollowing(userData.email)


    const handleEditProfileNavigation = () => {
        navigation.navigate("UserEditProfile", {
            userData
        })
    }


    const handleUserFollowingAndFollowerDisplay = (flag) => {
        let data
        if (flag === "followers") {
            data = followersData
        }
        if (flag === "following") {
            data = followingData
        }
        navigation.navigate("UserFollowingAndFollowersList", {
            userData: userData,
            data: data,
            paramFollowing: followingData,
            paramFollower: followersData,
            flag: flag
        })
    }

    return (
        <Animated.View style={{ flexDirection: "column", opacity: opacityContent }}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ width: "30%", justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            margin: 10,
                            borderWidth: 1.5,
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                        transition={50} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1, }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.values(userPosts).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.recipes')}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => handleUserFollowingAndFollowerDisplay("followers")} style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.followers).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.followers')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleUserFollowingAndFollowerDisplay("following")} style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.following).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.following')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


            {userData.displayed_name &&
                <View style={{ marginHorizontal: 20, maxHeight: 50, }} >
                    <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        {userData.displayed_name}
                    </Text>
                </View>
            }
            {userData.bio &&
                <View style={{ marginHorizontal: 20, maxHeight: 50 }} >
                    <Text style={{ color: theme.textPrimary }}>
                        {userData.bio}
                    </Text>
                </View>
            }
            {userData.link &&
                <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 20, marginTop: 5, maxHeight: 50, flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end" }}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={{ color: theme.textURL }}>
                        {extractDomain(userData.link)}
                    </Text>
                    <SvgComponent svgKey="LinkSVG" width={moderateScale(18)} height={moderateScale(18)} stroke={theme.textURL} />
                </TouchableOpacity>
            }
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={false}
                presentationStyle="pageSheet"
                statusBarTranslucent={false}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View
                    style={{ backgroundColor: theme.SubPrimary, flex: 1 }}
                >
                    <View style={{
                        height: 5,
                        width: 40,
                        backgroundColor: theme.Quinary,
                        borderRadius: 10,
                        marginTop: 10,
                        shadowColor: "black",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        backgroundColor: theme.Tertiary,
                        alignSelf: "center"
                    }} />
                    <View style={{ marginTop: 10 }}></View>
                    <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                    <WebView source={{ uri: userData.link }} />
                </View>
            </Modal>

            <View style={{
                justifyContent: "space-around",
                flexDirection: "row",
                marginHorizontal: 20,
                gap: 10,
            }} >
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleEditProfileNavigation()}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: theme.Quinary,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: theme.Quinary,
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: theme.textPrimary,
                            textAlign: "center"
                        }}>{t('screens.profile.text.profileContent.editProfile')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: theme.Quinary,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: theme.Quinary,
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: theme.textPrimary,
                            textAlign: "center"
                        }}>{t('screens.profile.text.profileContent.shareProfile')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

export default ProfileContent