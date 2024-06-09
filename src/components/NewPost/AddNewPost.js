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
import { Divider } from 'react-native-elements';
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
const { moderateScale } = initializeScalingUtils(Dimensions);
import { useNavigation } from "@react-navigation/native";

const AddNewPostHeader = ({ handleSubmit, isValid, theme, t }) => {
    const navigation = useNavigation();
    
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity style={{ margin: 10, }} onPress={() => navigation.goBack()}>
                    <SvgComponent svgKey="CloseSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 20, marginLeft: 15 }}>{t('screens.sharePost.headerTitle')}</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={handleSubmit} disabled={!isValid}>
                    <Text style={{ color: !isValid ? theme.textQuaternary : theme.appPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.sharePost.share')}</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color={theme.dividerPrimary} />
        </>
    )
}


export default AddNewPostHeader