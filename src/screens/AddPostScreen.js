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
    const { userData } = useContext(UserContext);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <FormikPostUploader theme={theme} t={t} userData={userData} />
        </SafeAreaView>
    )
}

export default AddPostScreen