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