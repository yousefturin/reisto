/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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

    //needs more work
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