import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import SvgComponent from '../../utils/SvgComponents';
import Modal from 'react-native-modal';

const Icons = [
    {
        name: 'Settings',
        iconTitle: 'SettingSVG',
    },
    {
        name: 'your activity',
        iconTitle: 'ActivitySVG',
    },
    {
        name: 'Saved',
        iconTitle: 'BookmarkNotActiveSVG',
    },
    {
        name: 'Log out',
        iconTitle: 'LogoutSVG',
    },
]
const ProfileHeader = ({ handleLogout, userData }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    // const navigation = useNavigation();
    const [isContainerVisible, setContainerVisible] = useState(false);
    const toggleContainer = () => {
        setContainerVisible(!isContainerVisible);
    };
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 25, marginLeft: 15 }}>{userData.username}</Text>
                <View style={{ margin: 10, height: moderateScale(30) }}>
                </View>
                <TouchableOpacity style={{ margin: 10 }} onPress={toggleContainer} >
                    <SvgComponent svgKey="MenuSVG" width={moderateScale(30)} height={moderateScale(30)} />
                </TouchableOpacity>
                <ProfileMenu setContainerVisible={setContainerVisible} isContainerVisible={isContainerVisible} handleLogout={handleLogout} moderateScale={moderateScale} />
            </View>
        </>
    )
}

const ProfileMenu = ({ isContainerVisible, setContainerVisible, handleLogout, moderateScale }) => {
    const screenHeight = Dimensions.get('window').height;
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
                backgroundColor: "#262626",
                height: screenHeight * 0.5,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }}>
                <ProfileMenuHeader />
                {/* mapping function did not work out because of onPress issues where it will be click by itself */}
                {/* Setting button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleSettings()} >
                    <SvgComponent svgKey={Icons[0].iconTitle} width={moderateScale(22)} height={moderateScale(22)} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "400" }}>{Icons[0].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color="#383838" />
                </View>
                {/* Activities button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleActivity()} >
                    <SvgComponent svgKey={Icons[1].iconTitle} width={moderateScale(22)} height={moderateScale(22)} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "400" }}>{Icons[1].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color="#383838" />
                </View>
                {/* Saved button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleSaved()} >
                    <SvgComponent svgKey={Icons[2].iconTitle} width={moderateScale(22)} height={moderateScale(22)} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "400" }}>{Icons[2].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color="#383838" />
                </View>
                {/* Logout button */}
                <TouchableOpacity style={{ margin: 10, marginLeft: 20, marginTop: 15, marginBottom: 15, flexDirection: "row", justifyContent: "flex-start", gap: 20, alignItems: "center" }} onPress={() => handleLogout()} >
                    <SvgComponent svgKey={Icons[3].iconTitle} width={moderateScale(22)} height={moderateScale(22)} />
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "400" }}>{Icons[3].name}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(61) }}>
                    <Divider width={0.5} orientation='horizontal' color="#383838" />
                </View>

            </View>
        </Modal>
    )
}


const ProfileMenuHeader = ({ }) => (
    <>
        <View style={{
            height: 5,
            width: 40,
            backgroundColor: "#1C1C1E",
            borderRadius: 10,
            marginTop: 10,
            shadowColor: "black",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            backgroundColor: "#2b2b2b",
            alignSelf: "center"
        }} />
    </>
)
export default ProfileHeader