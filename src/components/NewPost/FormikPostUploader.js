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

const uploadPostSchema = Yup.object().shape({
    imageURL: Yup.string().required('Image data is required'),
    caption: Yup.string().max(1200, 'Caption has reached the character limit.').required('Caption is required'),
    category: Yup.string().max(50, 'Category has reached the character limit.').required('Category is required'),
    timeOfMake: Yup.string().max(2, 'Time has reached the limit.').required('Time of Make is required'),
    captionIngredients: Yup.array()
        .of(Yup.string().trim().max(300, 'Each ingredient should not exceed 300 characters.'))
        .test('at-least-one', 'At least one ingredient is required', function (value) {
            return value && value.some(ingredient => ingredient && ingredient.trim().length > 0);
        })
        .min(1, 'At least one ingredient is required')
        .max(10, 'Exceeded maximum number of ingredients (10).')
        .required('Ingredients are required'),
    captionInstructions: Yup.array()
        .of(Yup.string().trim().max(300, 'Each instruction should not exceed 300 characters.'))
        .test('at-least-one', 'At least one instruction is required', function (value) {
            return value && value.some(instruction => instruction && instruction.trim().length > 0);
        })
        .min(1, 'At least one instruction is required')
        .max(10, 'Exceeded maximum number of instruction (10).')
        .required('Instructions are required'),
});


const FormikPostUploader = () => {
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
        return unsubscribe
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
                // console.log(width, height)
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
                    validationSchema={uploadPostSchema}
                    validateOnMount={true}>
                    {({ handleBlur, setFieldValue, handleChange, handleSubmit, values, errors, touched, isValid, setFieldTouched }) => (
                        <>
                            {/* there was no other way to pass the value */}
                            <AddNewPostHeader handleSubmit={handleSubmit} isValid={isValid} />
                            <ScrollView
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps={'always'} 
                                showsVerticalScrollIndicator={false}  >
                                <>
                                    <View style={{ marginBottom: 20 }}>
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            {!image ? (
                                                <TouchableOpacity
                                                    onPress={() => pickImage(setFieldValue, setFieldTouched)} activeOpacity={0.8}>
                                                    <SvgComponent svgKey="DummyImage" width={moderateScale(390)} height={moderateScale(280)} fill={'#ffffff'} />
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
                                        <Divider width={0.7} orientation='horizontal' color="#2b2b2b" />
                                        {touched.imageURL && errors.imageURL && (
                                            <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.imageURL}</Text>
                                        )}
                                        <FoodCategories setFieldValue={setFieldValue} values={values} handleBlur={handleBlur} />
                                        {errors.category && (
                                            <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.category}</Text>
                                        )}
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Text style={{ color: "#fff", marginVertical: 10, paddingTop: 10, fontSize: 20, fontWeight: "700" }}>Caption</Text>
                                            <TextInput
                                                style={{ fontSize: 18, color: "#fff", marginHorizontal: 10, marginVertical: 10 }}
                                                placeholder='Write a caption...' placeholderTextColor={"#2b2b2b"}
                                                multiline
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

                                            <Text style={{ color: "#fff", marginVertical: 10, fontSize: 20, fontWeight: "700" }}>Ingredients</Text>
                                            <TextInput
                                                multiline
                                                numberOfLines={10}
                                                placeholder='Enter ingredients...'
                                                placeholderTextColor={"#2b2b2b"}
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
                                                style={{ marginHorizontal: 10, marginVertical: 10, color: "#fff", fontSize: 18, }}
                                                value={Array.isArray(values.captionIngredients) ? values.captionIngredients.join('\n') : ''}
                                            />
                                            {touched.captionIngredients && errors.captionIngredients && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.captionIngredients}</Text>
                                            )}
                                            <Text style={{ color: "#fff", marginVertical: 10, fontSize: 20, fontWeight: "700" }}>Instructions</Text>
                                            <TextInput
                                                multiline
                                                numberOfLines={10}
                                                placeholder='Enter instructions...'
                                                placeholderTextColor={"#2b2b2b"}
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
                                                style={{ marginHorizontal: 10, marginVertical: 10, color: "#fff", fontSize: 18, }}
                                                value={Array.isArray(values.captionInstructions) ? values.captionInstructions.join('\n') : ''}
                                            />
                                            {touched.captionInstructions && errors.captionInstructions && (
                                                <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.captionInstructions}</Text>
                                            )}
                                            <Text style={{ color: "#fff", marginVertical: 10, fontSize: 20, fontWeight: "700" }}>Time of making</Text>
                                            <TextInput
                                                style={{ fontSize: 18, color: "#fff", marginHorizontal: 10, marginVertical: 10 }}
                                                placeholder='Write a time of preparation...' placeholderTextColor={"#2b2b2b"}
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