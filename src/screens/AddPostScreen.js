import { SafeAreaView } from 'react-native'
import React from 'react'
import FormikPostUploader from '../components/NewPost/FormikPostUploader'
import AddNewPostHeader from '../components/NewPost/AddNewPost'

const AddPostScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505"}}>
            <AddNewPostHeader />
                <FormikPostUploader />
        </SafeAreaView>
    )
}

export default AddPostScreen