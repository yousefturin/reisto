import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { useNavigation } from "@react-navigation/native";
import { colorPalette } from '../../Config/Theme';

const MessageMainHeader = ({ userData, excludedUsers }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const navigation = useNavigation();
    // This function will navigate to the new message screen
    const handleNavigationToNewMessage = () => {
        navigation.navigate("MessagingNewMessageForFollowerAndFollowings", { userData: userData, excludedUsers: excludedUsers });
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(40)} height={moderateScale(40)} />
                </TouchableOpacity>
                <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "800", fontSize: 25, }}>{userData.username}</Text>
            </View>
            <View style={{ margin: 10, height: moderateScale(30) }}>
            </View>
            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { handleNavigationToNewMessage() }}>
                <SvgComponent svgKey="EditSVG" width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        </View>
    )
}

export default MessageMainHeader