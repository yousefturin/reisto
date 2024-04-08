import { View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";

const NavigationStack = ({ userData,activeButton }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const navigation = useNavigation();
    const icons = [
        {
            action: 'Home',
            activeURL: 'HomeSVG',
            inActiveURL: 'HomeSVGInActive',
        },
        {
            action: 'Search',
            activeURL: 'SearchSVG',
            inActiveURL: 'SearchSVGInActive',
        },
        {
            action: 'AddPost',
            activeURL: 'AddPostSVG',
            inActiveURL: 'AddPostSVGInActive',
        },
        {
            action: 'Notification',
            activeURL: 'NotificationSVG',
            inActiveURL: 'NotificationSVGInActive',
        },
        {
            action: 'Profile',
            activeURL: `${userData.profile_picture}`,
        },
    ]
    //#region Post Footer
    const NavigationButtons = () => {
        return (
            <>
                <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                <View style={{ flexDirection: "row", justifyContent: "space-around", height: 55, paddingTop: 5 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Home");

                    }} style={{ padding: 10 }}>
                        {/* HomeBTn */}
                        <SvgComponent svgKey={activeButton === "Home" ? icons[0].activeURL : icons[0].inActiveURL} width={moderateScale(25)} height={moderateScale(25)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Search");

                    }} style={{ padding: 10 }}>
                        {/* SearchBtn */}
                        <SvgComponent svgKey={activeButton === "Search" ? icons[1].activeURL : icons[1].inActiveURL} width={moderateScale(25)} height={moderateScale(25)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("AddPost");

                    }} style={{ padding: 10 }}>
                        {/* AddPostBtn */}
                        <SvgComponent svgKey={activeButton === "AddPost" ? icons[2].activeURL : icons[2].inActiveURL} width={moderateScale(25)} height={moderateScale(25)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Notification");

                    }} style={{ padding: 10 }}>
                        {/* NotificationsBtn */}
                        <SvgComponent svgKey={activeButton === "Notification" ? icons[3].activeURL : icons[3].inActiveURL} width={moderateScale(25)} height={moderateScale(25)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Profile");

                    }} style={{ padding: 10 }}>
                        {/* ProfileBtn */}
                        <Image source={{ uri: icons[4].activeURL }} style={{
                            width: moderateScale(25),
                            height: moderateScale(25),
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: "#2b2b2b"
                        }} />
                    </TouchableOpacity>

                </View>
            </>

        )
    }
    //#endregion

    return (
        <View>
            <NavigationButtons userData={userData} />
        </View>
    )
}

export default NavigationStack