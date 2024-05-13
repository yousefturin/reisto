import { SafeAreaView } from 'react-native'
import React from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'
import { colorPalette } from '../Config/Theme'
import { getColorForTheme } from '../utils/ThemeUtils'
import { useTheme } from '../context/ThemeContext'

const AddPostScreen = () => {
    const { selectedTheme } = useTheme();
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPalette.dark, light: colorPalette.light },
        selectedTheme,
        systemTheme
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <FormikPostUploader theme={theme} />
        </SafeAreaView>
    )
}

export default AddPostScreen