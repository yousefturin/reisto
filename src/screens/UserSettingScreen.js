import { SafeAreaView } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import { colorPalette } from '../Config/Theme';
import ThemeSelector from '../components/UserSetting/ThemeSelector'
import LanguageSelector from '../components/UserSetting/LanguageSelector'
import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

const UserSettingScreen = () => {
    const { t, i18n } = useTranslation();
    const { selectedTheme, toggleTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <ThemeSelector theme={theme} selectedTheme={selectedTheme} toggleTheme={toggleTheme} t={t} />
            <LanguageSelector theme={theme} t={t} i18n={i18n} />
        </SafeAreaView>
    )
}

export default UserSettingScreen