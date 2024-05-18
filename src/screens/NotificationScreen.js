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