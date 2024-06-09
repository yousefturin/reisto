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




import React from 'react'
import { View, Dimensions, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from "../utils/SvgComponents";
import initializeScalingUtils from "../utils/NormalizeSize"
import SinginForm from '../components/Singin/SinginForm';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import UseCustomTheme from '../utils/UseCustomTheme';


const { moderateScale } = initializeScalingUtils(Dimensions);

export default function SignupScreen({ }) {
    const navigation = useNavigation();

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <SvgComponent svgKey="LogoSVG" width={moderateScale(80)} height={moderateScale(80)} fill={theme.textPrimary} />
                </View>
                <SinginForm navigation={navigation} theme={theme} />
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