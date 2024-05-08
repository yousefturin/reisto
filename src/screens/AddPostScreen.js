import { SafeAreaView } from 'react-native'
import React from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'
import { colorPalette } from '../Config/Theme'

const AddPostScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.dark.Primary }}>
                <FormikPostUploader />
        </SafeAreaView>
    )
}

export default AddPostScreen