import { View, Dimensions, TextInput, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
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




const { moderateScale } = initializeScalingUtils(Dimensions);

const uploadPostSchema = (t) => Yup.object().shape({
    imageURL: Yup.string().required(t('screens.sharePost.schemaWarnings.image.required')),
    caption: Yup.string().max(1200, t('screens.sharePost.schemaWarnings.caption.maxWarning')).required(t('screens.sharePost.schemaWarnings.caption.required')),
    category: Yup.string().max(50, t('screens.sharePost.schemaWarnings.category.maxWarning')).required(t('screens.sharePost.schemaWarnings.category.required')),
    timeOfMake: Yup.string().max(2, t('screens.sharePost.schemaWarnings.timeOfMake.maxWarning')).required(t('screens.sharePost.schemaWarnings.timeOfMake.required')),
    captionIngredients: Yup.array()
        .of(Yup.string().trim().max(300, t('screens.sharePost.schemaWarnings.ingredients.maxWarning')))
        .test('at-least-one', t('screens.sharePost.schemaWarnings.ingredients.condition1'), function (value) {
            return value && value.some(ingredient => ingredient && ingredient.trim().length > 0);
        })
        .min(1, t('screens.sharePost.schemaWarnings.ingredients.condition2'))
        .max(10, t('screens.sharePost.schemaWarnings.ingredients.condition3'))
        .required(t('screens.sharePost.schemaWarnings.ingredients.required')),
    captionInstructions: Yup.array()
        .of(Yup.string().trim().max(300, t('screens.sharePost.schemaWarnings.instructions.maxWarning')))
        .test('at-least-one', t('screens.sharePost.schemaWarnings.instructions.maxWarning'), function (value) {
            return value && value.some(instruction => instruction && instruction.trim().length > 0);
        })
        .min(1, t('screens.sharePost.schemaWarnings.instructions.maxWarning'))
        .max(10, t('screens.sharePost.schemaWarnings.instructions.maxWarning'))
        .required(t('screens.sharePost.schemaWarnings.instructions.maxWarning')),
});


const FormikPostUploader = ({ theme, t }) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

    const getUsernameFromFirebase = () => {
        const user = firebase.auth().currentUser
        // get the user name 
        const unsubscribe = db.collection('users').where('owner_uid', '==', user.uid).limit(1).onSnapshot(
            snapshot => snapshot.docs.map(doc => {
                setCurrentLoggedInUser({
                    username: doc.data().username,
                    profilePicture: doc.data().profile_picture,
                }
                )
            })
        )
        return unsubscribe;
    }

    useEffect(() => {
        getUsernameFromFirebase()
    }, [])

    const postPostToFirebase = (caption, imageURL, category, timeOfMake, captionIngredients, captionInstructions) => {
        const unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).collection('posts').add({
            imageURL: imageURL,
            user: currentLoggedInUser.username,
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
            .then(() => navigation.goBack())
        return unsubscribe
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

            const dbImage = await UploadImageToStorage(compressedImage.uri);

            if (dbImage) {
                setFieldValue('imageURL', dbImage);
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
        </KeyboardAvoidingView >
    )
}

export default FormikPostUploader