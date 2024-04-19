import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import initializeScalingUtils from '../../utils/NormalizeSize';
import SvgComponent from '../../utils/SvgComponents';

const OthersProfileHeader = ({ userDataToBeNavigated }) => {
    const navigation = useNavigation();
    const handlePressBack = () => {
        navigation.goBack()
    }
    const { moderateScale } = initializeScalingUtils(Dimensions);
    //needs more work
    const handleNavigationToMessages = () => {
        let userDataUid = userDataToBeNavigated
        navigation.navigate('MessageIndividual', { userDataUid: userDataUid })
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 20, }}>{userDataToBeNavigated.username}</Text>
            </View>
            <TouchableOpacity onPress={() => handleNavigationToMessages()} style={{ width: moderateScale(30) }}>
                <Text style={{ color: "#fff", fontWeight: "900", }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OthersProfileHeader