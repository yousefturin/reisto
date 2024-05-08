import React from 'react'
import { View, Dimensions, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from "../utils/SvgComponents";
import initializeScalingUtils from "../utils/NormalizeSize"
import SinginForm from '../components/Singin/SinginForm';
import { colorPalette } from '../Config/Theme';


const { moderateScale } = initializeScalingUtils(Dimensions);

export default function SignupScreen({ }) {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.dark.Primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <SvgComponent svgKey="LogoSVG" width={moderateScale(80)} height={moderateScale(80)} fill={colorPalette.dark.textPrimary} />
                </View>
                <SinginForm navigation={navigation} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 50,
        marginBottom: 30
    },
});