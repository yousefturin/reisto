import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import HeaderEditProfileIndividual from '../components/UserEditProfileIndividualData/HeaderEditProfileIndividual';
import { TextInput } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import SvgComponent from '../utils/SvgComponents';
import initializeScalingUtils from '../utils/NormalizeSize';
import * as Yup from 'yup'
import { Formik } from 'formik'
import { db, firebase } from '../firebase';
import { colorPalette } from '../Config/Theme';

const UserEditProfileIndividualDataScreen = ({ route }) => {
    const { userData, key, value } = route.params
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ backgroundColor: colorPalette.dark.Primary , flex: 1, justifyContent: "flex-start" }}>
            <ContentEditProfileIndividual headerTitle={key} navigation={navigation} prevValue={value} />
        </SafeAreaView>
    )
}
const ContentEditProfileIndividual = ({ headerTitle, navigation, prevValue }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const PushDataToFireBase = (value, key) => {
        let unsubscribe
        switch (key) {
            case 'Name':
                unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).update({
                    displayed_name: value
                }).then(() => {
                    console.log('Document successfully updated!');
                    navigation.goBack();
                }).catch(error => {
                    console.error('Error updating document: ', error)
                })
                return unsubscribe
            case 'Bio':
                unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).update({
                    bio: value
                }).then(() => navigation.goBack())
                return unsubscribe
            case 'Link':
                unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email).update({
                    link: value
                }).then(() => navigation.goBack())
                return unsubscribe
        }
    }
    switch (headerTitle) {
        case 'Name': {
            return (
                <Formik
                    initialValues={{ DisplayedName: prevValue ? prevValue : '' }}
                    onSubmit={(values) => {
                        PushDataToFireBase(values.DisplayedName, "Name")
                    }}
                    validationSchema={uploadNameSchema}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual navigation={navigation} headerTitle={headerTitle} handleSubmit={handleSubmit} isValid={isValid} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${headerTitle}`}
                                    placeholderTextColor={colorPalette.dark.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.DisplayedName}
                                    onChangeText={handleChange('DisplayedName')}
                                    onBlur={() => {
                                        handleBlur('DisplayedName')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: colorPalette.dark.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('DisplayedName', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={colorPalette.dark.dividerPrimary} />
                            {errors.DisplayedName && (
                                <Text style={{ fontSize: 13, color: "tomato", marginHorizontal: 10, marginTop: 5, marginLeft: 20, }}>*{errors.DisplayedName}</Text>
                            )}
                            <Text
                                style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 14, fontWeight: "400", color: colorPalette.dark.textTertiary, }}
                            >Help people discover your account by using the name you're known by: either your full name, nickname or business name.</Text>
                            <Text
                                style={{ marginHorizontal: 10, marginLeft: 20, fontSize: 14, fontWeight: "400", color: colorPalette.dark.textTertiary, }}
                            >You can only change your name once withing 14 days.</Text>
                        </>
                    )}
                </Formik>
            )
        }
        case 'Bio': {
            return (
                <Formik
                    initialValues={{ Bio: prevValue ? prevValue : '' }}
                    onSubmit={(values) => {
                        PushDataToFireBase(values.Bio, "Bio")
                    }}
                    validationSchema={uploadBioSchema}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual navigation={navigation} headerTitle={headerTitle} handleSubmit={handleSubmit} isValid={isValid} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${headerTitle}`}
                                    placeholderTextColor={colorPalette.dark.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.Bio}
                                    onChangeText={handleChange('Bio')}
                                    onBlur={() => {
                                        handleBlur('Bio')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: colorPalette.dark.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('Bio', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={colorPalette.dark.dividerPrimary}  />
                            {errors.Bio && (
                                <Text style={{ fontSize: 13, color: "tomato", marginHorizontal: 10, marginTop: 5, marginLeft: 20, }}>*{errors.Bio}</Text>
                            )}
                        </>
                    )}
                </Formik>
            )
        }
        case 'Link': {
            return (
                <Formik
                    initialValues={{ Link: prevValue ? prevValue : '' }}
                    onSubmit={(values) => {
                        PushDataToFireBase(values.Link, "Link")
                    }}
                    validationSchema={uploadLinkSchema}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual navigation={navigation} headerTitle={headerTitle} handleSubmit={handleSubmit} isValid={isValid} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${headerTitle}`}
                                    placeholderTextColor={colorPalette.dark.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.Link}
                                    onChangeText={handleChange('Link')}
                                    onBlur={() => {
                                        handleBlur('Link')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: colorPalette.dark.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('Link', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={colorPalette.dark.dividerPrimary}  />
                            {errors.Link && (
                                <Text style={{ fontSize: 13, color: "tomato", marginHorizontal: 10, marginTop: 5, marginLeft: 20, }}>*{errors.Link}</Text>
                            )}
                        </>
                    )}
                </Formik>
            )
        }
        default:
            break;
    }
}
const uploadNameSchema = Yup.object().shape({
    DisplayedName: Yup.string().required().min(4, 'Name must be less than 4 characters.').max(15, 'Name should not be longer than 15 characters.')
})
const uploadBioSchema = Yup.object().shape({
    Bio: Yup.string().min(10, 'Bio must be less than 10 characters.').max(160, 'Bio should not be longer than 160 characters.')
})
const uploadLinkSchema = Yup.object().shape({
    Link: Yup.string().url('This must be a valid URL.')
})
export default UserEditProfileIndividualDataScreen