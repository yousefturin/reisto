import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';
import { Divider } from 'react-native-elements';


const MessagesIndividualHeader = ({ header }) => {
    const navigation = useNavigation();
    const handlePressBack = () => {
        navigation.goBack()
    }
    const { moderateScale } = initializeScalingUtils(Dimensions);
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10, }}>
                <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flex: 1, gap: 10 }}>
                    <Image
                        source={{ uri: header.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: "#2b2b2b"
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                        transition={50}
                    />
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 20, }}>{header.username}</Text>
                </View>
                <View style={{ margin: 10, width: moderateScale(30) }}>
                </View>
            </View>
            <Divider width={0.5} orientation='horizontal' color="#2b2b2b" />
        </>
    )
}

export default MessagesIndividualHeader