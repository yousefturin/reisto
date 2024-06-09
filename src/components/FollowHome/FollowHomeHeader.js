
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