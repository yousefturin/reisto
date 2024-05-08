import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import initializeScalingUtils from '../../utils/NormalizeSize'
import { TouchableOpacity } from 'react-native-gesture-handler'
import SvgComponent from '../../utils/SvgComponents'
import { colorPalette } from '../../Config/Theme'

const EditProfileHeader = ({ navigation, headerTitle }) => {
    const handlePressBack = () => {
        navigation.goBack()
    }
    const { moderateScale } = initializeScalingUtils(Dimensions);
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "600", fontSize: 20, }}>{headerTitle}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default EditProfileHeader