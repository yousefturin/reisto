import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
const { moderateScale } = initializeScalingUtils(Dimensions);
import { useNavigation } from "@react-navigation/native";


const AddNewPostHeader = () => {
    const navigation = useNavigation();
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity style={{ margin: 10, }} onPress={() => navigation.goBack()}>
                    <SvgComponent svgKey="CloseSVG" width={moderateScale(30)} height={moderateScale(30)} />
                </TouchableOpacity>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20, marginLeft: 15 }}>New Post</Text>
                <TouchableOpacity style={{ margin: 10 }}>
                    <Text style={{ color: "#0E7AFE", fontWeight: "600", fontSize: 20, }}>Share</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color="#2b2b2b" />
        </>
    )
}



export default AddNewPostHeader