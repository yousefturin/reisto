/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { View, Dimensions, TextInput, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import * as ImagePicker from 'expo-image-picker';
import { Divider } from 'react-native-elements';
import FoodCategories from './FoodCategoriesSelector';
import { useNavigation } from "@react-navigation/native";
import { firebase, db } from '../../firebase'
import * as ImageManipulator from 'expo-image-manipulator';
import AddNewPostHeader from './AddNewPost';
import UploadImageToStorage from '../../utils/UploadImageToStorage';
import { Image } from 'expo-image';
import { uploadPostSchema } from '../../Config/Schemas';

const { moderateScale } = initializeScalingUtils(Dimensions);


const FormikPostUploader = ({ theme, t, userData }) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);



    const postPostToFirebase = async (caption, imageURL, category, timeOfMake, captionIngredients, captionInstructions) => {
        navigation.goBack()
        try {
            console.log("Only now the image is uploaded to the database")
            const dbImage = await UploadImageToStorage(imageURL, "/PostImages/");

            const unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).collection('posts').add({
                imageURL: dbImage,
                user: userData.username,
                // profile_picture: currentLoggedInUser.profilePicture,
                owner_uid: firebase.auth().currentUser.uid,
                owner_email: firebase.auth().currentUser.email,
                caption: caption,
                category: category,
                timeOfMake: timeOfMake,
                captionIngredients: captionIngredients,
                captionInstructions: captionInstructions,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes_by_users: [],
                comments: [],
            })
            return unsubscribe
        } catch (error) {
            console.error("Error uploading image to the database", error)
        }

    }

    // this must be fixed not every image is selected needs to be stored on the cloud this is shit<<<<<<<<<<-
    const pickImage = async (setFieldValue, setFieldTouched) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);

            const maxWidth = 700; // Maximum width for resizing
            const originalWidth = result.assets[0].width;
            const originalHeight = result.assets[0].height;
            const aspectRatio = originalWidth / originalHeight;

            let width = originalWidth;
            let height = originalHeight;
            // fuck me still cant find how to cut the image into 700X700
            if (originalWidth > maxWidth) {
                width = maxWidth;
                // the issue with white border is that the height is for example 700.2314814814815 and that will make a problem 
                //              showing a artifact white line to fix teh issue rounding the number is applied.
                height = Math.round(maxWidth / aspectRatio)
            }

            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width, height } }],
                { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
            );
            // const compressesImage = compressedImage.uri
            // const dbImage = await UploadImageToStorage(compressedImage.uri);

            if (compressedImage.uri) {
                setFieldValue('imageURL', compressedImage.uri);
            }
        } else if (result.canceled) {
            setFieldTouched('imageURL', true);
        }
    };
    // a big problem is here, when user select an image it will be uploaded to database but it must be on submit.

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <>
                <Formik
                    initialValues={{ caption: '', imageURL: '', category: '', timeOfMake: '', captionIngredients: [], captionInstructions: [] }}
                    onSubmit={(values) => {
                        postPostToFirebase(values.caption, values.imageURL, values.category, values.timeOfMake, values.captionIngredients, values.captionInstructions)
                    }}
                    validationSchema={uploadPostSchema(t)}
                    validateOnMount={true}>
                    {({ handleBlur, setFieldValue, handleChange, handleSubmit, values, errors, touched, isValid, setFieldTouched }) => (
                        <>
                            {/* there was no other way to pass the value */}
                            <AddNewPostHeader handleSubmit={handleSubmit} isValid={isValid} theme={theme} t={t} />
                            <ScrollView
                                // keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps={'always'}
                                showsVerticalScrollIndicator={false}  >
                                <>
                                    <View style={{ marginBottom: 20 }}>
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            {!image ? (
                                                <TouchableOpacity
                                                    onPress={() => pickImage(setFieldValue, setFieldTouched)} activeOpacity={0.8}>
                                                    <SvgComponent svgKey="DummyImage" width={moderateScale(380)} height={moderateScale(380)} fill={theme.textPrimary} />
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => pickImage(setFieldValue, setFieldTouched)}
                                                    value={values.imageURL}>
                                                    <Image source={{ uri: image }} style={{
                                                        aspectRatio: 4 / 4,
                                                        width: "100%",
                                                        height: "auto",
                                                    }} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Divider width={0.7} orientation='horizontal' color={theme.dividerPrimary} />
                                        {touched.imageURL && errors.imageURL && (
                                            <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.imageURL}</Text>
                                        )}
                                        <FoodCategories setFieldValue={setFieldValue} values={values} handleBlur={handleBlur} t={t} />
                                        {errors.category && (
                                            <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.category}</Text>
                                        )}
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Text style={{ color: theme.textPrimary, marginVertical: 10, paddingTop: 10, fontSize: 20, fontWeight: "700" }}>{t('screens.sharePost.caption')}</Text>
                                            <TextInput
                                                style={{ fontSize: 18, color: theme.textPrimary, marginHorizontal: 10, marginVertical: 10 }}
                                                placeholder={t('screens.sharePost.captionPlaceholder')} placeholderTextColor={theme.textPlaceholder}
                                                multiline
                                                scrollEnabled={false}
                                                textContentType='none'
                                                keyboardType='default'
                                                onChangeText={handleChange('caption')}
                                                onFocus={() => {
                                                    setFieldTouched('caption', true);
                                                }}
                                                onBlur={() => {
                                                    handleBlur('caption')
                                                }}
                                                value={values.caption}
                                            />
                                            {touched.caption && errors.caption && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.caption}</Text>
                                            )}
                                            {/* will be change to custom picker */}

                                            <Text style={{ color: theme.textPrimary, marginVertical: 10, fontSize: 20, fontWeight: "700" }}>{t('screens.sharePost.ingredients')}</Text>
                                            <TextInput
                                                multiline
                                                numberOfLines={10}
                                                scrollEnabled={false}//the issue with keyboard avoiding view since 2017 and still no fix from facebook to this issue, and the only work around is to use scrollEnabled={false}
                                                placeholder={t('screens.sharePost.ingredientsPlaceholder')}
                                                placeholderTextColor={theme.textPlaceholder}
                                                textContentType='none'
                                                keyboardType='default'
                                                onFocus={() => {
                                                    setFieldTouched('captionIngredients', true);
                                                }}
                                                onChangeText={(text) => {
                                                    setFieldValue('captionIngredients', text.split('\n'));
                                                }}
                                                onBlur={() => {
                                                    handleBlur('captionIngredients')
                                                }}
                                                style={{ marginHorizontal: 10, marginVertical: 10, color: theme.textPrimary, fontSize: 18, }}
                                                value={Array.isArray(values.captionIngredients) ? values.captionIngredients.join('\n') : ''}
                                            />
                                            {touched.captionIngredients && errors.captionIngredients && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.captionIngredients}</Text>
                                            )}
                                            <Text style={{ color: theme.textPrimary, marginVertical: 10, fontSize: 20, fontWeight: "700" }}>{t('screens.sharePost.instructions')}</Text>
                                            <TextInput
                                                multiline
                                                scrollEnabled={false}
                                                numberOfLines={10}
                                                placeholder={t('screens.sharePost.instructionsPlaceholder')}
                                                placeholderTextColor={theme.textPlaceholder}
                                                textContentType='none'
                                                keyboardType='default'
                                                onChangeText={(text) => {
                                                    setFieldValue('captionInstructions', text.split('\n'));
                                                }}
                                                onBlur={() => {
                                                    handleBlur('captionInstructions')
                                                }}
                                                onFocus={() => {
                                                    setFieldTouched('captionInstructions', true);
                                                }}
                                                style={{ marginHorizontal: 10, marginVertical: 10, color: theme.textPrimary, fontSize: 18, }}
                                                value={Array.isArray(values.captionInstructions) ? values.captionInstructions.join('\n') : ''}
                                            />
                                            {touched.captionInstructions && errors.captionInstructions && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.captionInstructions}</Text>
                                            )}
                                            <Text style={{ color: theme.textPrimary, marginVertical: 10, fontSize: 20, fontWeight: "700" }}>{t('screens.sharePost.timeOfMake')}</Text>
                                            <TextInput
                                                style={{ fontSize: 18, color: theme.textPrimary, marginHorizontal: 10, marginVertical: 10 }}
                                                placeholder={t('screens.sharePost.timeOfMakePlaceholder')} placeholderTextColor={theme.textPlaceholder}
                                                textContentType='none'
                                                keyboardType='numeric'
                                                onChangeText={handleChange('timeOfMake')}
                                                onBlur={() => {
                                                    handleBlur('timeOfMake')
                                                }}
                                                onFocus={() => {
                                                    setFieldTouched('timeOfMake', true);
                                                }}
                                                value={values.timeOfMake.toString()}
                                            />
                                            {touched.timeOfMake && errors.timeOfMake && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.timeOfMake}</Text>
                                            )}
                                        </View>
                                    </View>
                                    <View style={{ paddingVertical: 40 }} />
                                </>
                            </ScrollView>
                        </>
                    )}
                </Formik>
            </>
        </KeyboardAvoidingView>
    )
}

export default FormikPostUploader