import { SafeAreaView } from 'react-native'
import React from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'
import { colorPalette } from '../Config/Theme'

import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'

const AddPostScreen = () => {
    const { t } = useTranslation();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <FormikPostUploader theme={theme} t={t} />
        </SafeAreaView>
    )
}

export default AddPostScreen