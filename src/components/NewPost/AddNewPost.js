import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
const { moderateScale } = initializeScalingUtils(Dimensions);
import { useNavigation } from "@react-navigation/native";
import { colorPalette } from '../../Config/Theme';

const AddNewPostHeader = ({ handleSubmit, isValid, theme }) => {
    const navigation = useNavigation();
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity style={{ margin: 10, }} onPress={() => navigation.goBack()}>
                    <SvgComponent svgKey="CloseSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 20, marginLeft: 15 }}>New Post</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={handleSubmit} disabled={!isValid}>
                    <Text style={{ color: !isValid ? theme.textQuaternary : theme.appPrimary, fontWeight: "600", fontSize: 20, }}>Share</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color={theme.dividerPrimary} />
        </>
    )
}


export default AddNewPostHeader