/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import SvgComponent from '../../utils/SvgComponents';
import Modal from 'react-native-modal';


const ProfileHeader = ({ handleLogout, userData, theme, t, opacity }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [isContainerVisible, setContainerVisible] = useState(false);

    const toggleContainer = () => {
        setContainerVisible(!isContainerVisible);
    };
    
    return (
        <>
            <Animated.View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10, opacity: opacity }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "800", fontSize: 25, marginLeft: 15 }}>{userData.username}</Text>
                <View style={{ margin: 10, height: moderateScale(30) }}>
                </View>
                <TouchableOpacity style={{ margin: 10 }} onPress={toggleContainer} >
                    <SvgComponent svgKey="MenuSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <ProfileMenu t={t} theme={theme} setContainerVisible={setContainerVisible} isContainerVisible={isContainerVisible} handleLogout={handleLogout} moderateScale={moderateScale} />
            </Animated.View>
        </>
    )
}

const ProfileMenu = ({ isContainerVisible, setContainerVisible, handleLogout, moderateScale, theme, t }) => {
    const screenHeight = Dimensions.get('window').height;
    const Icons = [
        {
            name: t('screens.profile.text.profileHeader.profileMenu.settings'),
            iconTitle: 'SettingSVG',
        },
        {
            name: t('screens.profile.text.profileHeader.profileMenu.activity'),
            iconTitle: 'ActivitySVG',
        },
        {
            name: t('screens.profile.text.profileHeader.profileMenu.saved'),
            iconTitle: 'BookmarkNotActiveSVG',
        },
        {
            name: t('screens.profile.text.profileHeader.profileMenu.logout'),
            iconTitle: 'LogoutSVG',
        },
    ]
    const navigation = useNavigation();
    const handleSettings = () => {
        setContainerVisible(false)
        navigation.navigate("UserSetting")
    }
    const handleActivity = () => {
        setContainerVisible(false)
        navigation.navigate("UserActivity")
    }
    const handleSaved = () => {
        setContainerVisible(false)
        navigation.navigate("UserSavedPost")
    }
    return (
        <Modal
            isVisible={isContainerVisible}
            onSwipeComplete={() => setContainerVisible(false)}
            onBackdropPress={() => setContainerVisible(false)}
            swipeDirection="down"
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={{
                backgroundColor: theme.SubPrimary,
                height: screenHeight * 0.35,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }}>
                <ProfileMenuHeader theme={theme} />
                {/* mapping function did not work out because of onPress issues where it will be click by itself */}
                {/* Setting button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleSettings()} >
                    <SvgComponent svgKey={Icons[0].iconTitle} width={moderateScale(22)} height={moderateScale(22)} stroke={theme.textPrimary} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "400" }}>{Icons[0].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                </View>
                {/* Activities button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleActivity()} >
                    <SvgComponent svgKey={Icons[1].iconTitle} width={moderateScale(22)} height={moderateScale(22)} stroke={theme.textPrimary} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "400" }}>{Icons[1].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                </View>
                {/* Saved button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleSaved()} >
                    <SvgComponent svgKey={Icons[2].iconTitle} width={moderateScale(22)} height={moderateScale(22)} stroke={theme.textPrimary} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "400" }}>{Icons[2].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                </View>
                {/* Logout button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleLogout()} >
                    <SvgComponent svgKey={Icons[3].iconTitle} width={moderateScale(22)} height={moderateScale(22)} stroke={theme.textPrimary} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "400" }}>{Icons[3].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                </View>

            </View>
        </Modal>
    )
}


const ProfileMenuHeader = ({ theme }) => (
    <>
        <View style={{
            height: 5,
            width: 40,
            borderRadius: 10,
            marginTop: 10,
            shadowColor: "black",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            backgroundColor: theme.notch,
            alignSelf: "center"
        }} />
    </>
)
export default ProfileHeader