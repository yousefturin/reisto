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




import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';

const SearchSuggestion = ({ searchQuery, theme, navigation }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    return (
        <TouchableOpacity style={{ flexDirection: "row", paddingTop: 10, }} onPress={() => { navigation.navigate('AdditionalSearchScreen', { searchQuery: searchQuery }) }}>
            <View style={{ width: "20%", justifyContent: "center", alignItems: "center", }}>
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    margin: 7,
                    borderWidth: 1.5,
                    borderColor: theme.Secondary,
                    justifyContent: "center", alignItems: "center"
                }}>
                    <SvgComponent svgKey="SearchSVGInActive" width={moderateScale(20)} height={moderateScale(20)} stroke={theme.textPrimary} />
                </View>
            </View>
            <View style={{ flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "flex-start" }}>
                <Text style={{ color: theme.textPrimary, fontWeight: "500", fontSize: 16 }}>{searchQuery}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchSuggestion