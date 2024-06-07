/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { SafeAreaView } from 'react-native'
import React from 'react'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext';

import UseCustomTheme from '../utils/UseCustomTheme';

const NotificationScreen = () => {
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary , justifyContent: "flex-end" }}>
        </SafeAreaView>
    )
}

export default NotificationScreen