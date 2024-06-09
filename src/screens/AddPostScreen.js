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
import React, { useContext } from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'
import { colorPalette } from '../Config/Theme'

import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'
import { UserContext } from '../context/UserDataProvider'

const AddPostScreen = () => {
    const { t } = useTranslation();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const userData = useContext(UserContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <FormikPostUploader theme={theme} t={t} userData={userData} />
        </SafeAreaView>
    )
}

export default AddPostScreen