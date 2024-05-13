import { SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext';
import { getColorForTheme } from '../utils/ThemeUtils';

const NotificationScreen = () => {
    const { selectedTheme } = useTheme();
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPalette.dark, light: colorPalette.light },
        selectedTheme,
        systemTheme
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary , justifyContent: "flex-end" }}>
        </SafeAreaView>
    )
}

export default NotificationScreen