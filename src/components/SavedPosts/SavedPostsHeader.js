import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';


const SavedPostsHeader = () => {
    const navigation = useNavigation();
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
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 20, }}>All Posts</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default SavedPostsHeader