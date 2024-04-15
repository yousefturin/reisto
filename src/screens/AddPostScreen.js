import { SafeAreaView } from 'react-native'
import React from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'

const AddPostScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505"}}>
                <FormikPostUploader />
        </SafeAreaView>
    )
}

export default AddPostScreen