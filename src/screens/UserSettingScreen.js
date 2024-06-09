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