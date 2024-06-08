/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




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
import { useTheme } from '../context/ThemeContext';
import { uploadBioSchema, uploadLinkSchema, uploadNameSchema } from '../Config/Schemas';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

const UserEditProfileIndividualDataScreen = ({ route }) => {
    const { _, key, value, headerTitleForScreen } = route.params
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ backgroundColor: theme.Primary, flex: 1, justifyContent: "flex-start" }}>
            <ContentEditProfileIndividual t={t} theme={theme} headerTitle={key} title={headerTitleForScreen} navigation={navigation} prevValue={value} />
        </SafeAreaView>
    )
}

const ContentEditProfileIndividual = ({ headerTitle, navigation, prevValue, theme, title, t }) => {
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
                    validationSchema={uploadNameSchema(t)}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual t={t} theme={theme} navigation={navigation} headerTitle={title} handleSubmit={handleSubmit} isValid={isValid} prevValue={prevValue} values={values.DisplayedName} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${title}`}
                                    placeholderTextColor={theme.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.DisplayedName}
                                    onChangeText={handleChange('DisplayedName')}
                                    onBlur={() => {
                                        handleBlur('DisplayedName')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('DisplayedName', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                            {errors.DisplayedName && (
                                <Text style={{ fontSize: 13, color: "tomato", marginHorizontal: 10, marginTop: 5, marginLeft: 20, }}>*{errors.DisplayedName}</Text>
                            )}
                            <Text
                                style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 14, fontWeight: "400", color: theme.textTertiary, }}
                            >{t('screens.profile.text.profileEdit.nameInstruction1')}</Text>
                            <Text
                                style={{ marginHorizontal: 10, marginLeft: 20, fontSize: 14, fontWeight: "400", color: theme.textTertiary, }}
                            >{t('screens.profile.text.profileEdit.nameInstruction2')}</Text>
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
                    validationSchema={uploadBioSchema(t)}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual t={t} theme={theme} navigation={navigation} headerTitle={title} handleSubmit={handleSubmit} isValid={isValid} prevValue={prevValue} values={values.Bio} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${title}`}
                                    placeholderTextColor={theme.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.Bio}
                                    onChangeText={handleChange('Bio')}
                                    onBlur={() => {
                                        handleBlur('Bio')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('Bio', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
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
                    validationSchema={uploadLinkSchema(t)}
                    validateOnMount={true}>
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, setFieldValue }) => (
                        <>
                            <HeaderEditProfileIndividual t={t} theme={theme} navigation={navigation} headerTitle={title} handleSubmit={handleSubmit} isValid={isValid} prevValue={prevValue} values={values.Link} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <TextInput
                                    multiline={false}
                                    autoFocus
                                    placeholder={`${title}`}
                                    placeholderTextColor={theme.textTertiary}
                                    textContentType='none'
                                    keyboardType='default'
                                    value={values.Link}
                                    onChangeText={handleChange('Link')}
                                    onBlur={() => {
                                        handleBlur('Link')
                                    }}
                                    style={{ marginHorizontal: 10, marginVertical: 20, marginLeft: 20, fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, }}
                                />
                                <TouchableOpacity style={{ padding: 10, marginRight: 10 }} onPress={() => setFieldValue('Link', '')}>
                                    <SvgComponent svgKey="CloseCirclerSVG" width={moderateScale(18)} height={moderateScale(18)} />
                                </TouchableOpacity>
                            </View>
                            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
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

export default UserEditProfileIndividualDataScreen