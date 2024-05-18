import { View, Text, Dimensions, TouchableOpacity, Animated } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { useNavigation } from "@react-navigation/native";

const MessageMainHeader = ({ userData, excludedUsers, theme, opacity }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const navigation = useNavigation();

    // This function will navigate to the new message screen
    const handleNavigationToNewMessage = () => {
        navigation.navigate("MessagingNewMessageForFollowerAndFollowings", { userData: userData, excludedUsers: excludedUsers, theme: theme });
    }
    
    return (
            <Animated.View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", opacity: opacity, marginHorizontal: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(40)} height={moderateScale(40)} stroke={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={{ color: theme.textPrimary, fontWeight: "800", fontSize: 25, }}>{userData.username}</Text>
                </View>
                <View style={{ margin: 10, height: moderateScale(30) }}>
                </View>
                <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => { handleNavigationToNewMessage() }}>
                    <SvgComponent svgKey="EditSVG" width={moderateScale(24)} height={moderateScale(24)} stroke={theme.textPrimary} />
                </TouchableOpacity>
            </Animated.View>
    )
}

export default MessageMainHeader