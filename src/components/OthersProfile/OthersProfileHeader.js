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




import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import initializeScalingUtils from '../../utils/NormalizeSize';
import SvgComponent from '../../utils/SvgComponents';

const OthersProfileHeader = ({ userDataToBeNavigated, theme }) => {
    const navigation = useNavigation();
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const handlePressBack = () => {
        navigation.goBack()
    }

    //This is only for texting purposes, will be removed in the future
    const handleNavigationToMessages = () => {
        let userDataUid = userDataToBeNavigated
        navigation.navigate('MessageIndividual', { userDataUid: userDataUid })
    }
    
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{userDataToBeNavigated.username}</Text>
            </View>
            <TouchableOpacity onPress={() => handleNavigationToMessages()} style={{ width: moderateScale(30) }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "900", }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OthersProfileHeader