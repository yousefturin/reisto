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




import { View, Text, Dimensions, Animated } from 'react-native'
import React from 'react'
import initializeScalingUtils from '../../utils/NormalizeSize'
import { TouchableOpacity } from 'react-native-gesture-handler'
import SvgComponent from '../../utils/SvgComponents'

const EditProfileHeader = ({ navigation, headerTitle, theme, opacity }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const handlePressBack = () => {
        navigation.goBack()
    }
    
    return (
        <Animated.View style={{ opacity: opacity, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{headerTitle}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </Animated.View>
    )
}

export default EditProfileHeader