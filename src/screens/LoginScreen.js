import React from 'react'
import { View, Dimensions, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from "../utils/SvgComponents";
import initializeScalingUtils from "../utils/NormalizeSize"
import LoginForm from '../components/Login/LoginForm';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import UseCustomTheme from '../utils/UseCustomTheme';

const { moderateScale } = initializeScalingUtils(Dimensions);

export default function LoginScreen({ }) {
    const navigation = useNavigation();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <SvgComponent svgKey="LogoSVG" width={moderateScale(80)} height={moderateScale(80)} fill={theme.textPrimary} />
                </View>
                <LoginForm navigation={navigation} theme={theme} />
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
        marginVertical: 30,
        marginBottom: 30
    },
});