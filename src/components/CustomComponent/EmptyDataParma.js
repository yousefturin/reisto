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