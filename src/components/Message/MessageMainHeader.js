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