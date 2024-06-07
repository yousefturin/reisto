
/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents';
import { useNavigation } from "@react-navigation/native";
import initializeScalingUtils from '../../utils/NormalizeSize';

const FollowHomeHeader = ({ theme, opacity }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const navigation = useNavigation();

    return (
        <Animated.View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal: 10, opacity: opacity }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.goBack()} >
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={{ color: theme.textPrimary, fontWeight: "800", fontSize: 25 }}>Following</Text>
        </Animated.View>
    )
}

export default FollowHomeHeader