/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */

import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';

const EmptyDataParma = ({ theme, dataMessage, TitleDataMessage, SvgElement }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    
    return (
        <View style={{ height: "90%", }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                <SvgComponent svgKey={SvgElement} width={moderateScale(60)} height={moderateScale(60)} stroke={theme.textPrimary} />
                {TitleDataMessage &&
                    <Text style={{ width: "100%", color: theme.textPrimary, fontSize: 24, fontWeight: "700", padding: 15, paddingTop: 20, textAlign: "center" }}>{TitleDataMessage}</Text>
                }
                <Text style={{ paddingHorizontal: 50, width: "100%", color: theme.textTertiary, opacity: 0.7, textAlign: "center" }}>{dataMessage}</Text>
            </View>
        </View>
    )
}

export default EmptyDataParma