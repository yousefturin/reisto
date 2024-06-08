/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import React from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Validator from 'email-validator'
import { firebase, db } from '../../firebase';
import { colorPalette } from '../../Config/Theme'
import { useTranslation } from 'react-i18next'
import { SinginFormSchema } from '../../Config/Schemas'

const SinginForm = ({ navigation, theme }) => {
    const { t } = useTranslation();

    const onSingin = async (email, password, name) => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(userCredential.user.email).set({
                owner_uid: userCredential.user.uid,
                username: name,
                bio: "",
                link: "",
                displayed_name: "",
                email: userCredential.user.email,
                profile_picture: "https://firebasestorage.googleapis.com/v0/b/reisto-dev.appspot.com/o/ProfileImages%2FimagePlcaeHolder%20(Custom).png?alt=media&token=5b62cde4-d4cc-423c-8bc5-950efe565574",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            savedPostCreation(userCredential);
            // followersAndFollowingUserCreation(userCredential);
        } catch (error) {
            let msg = error.message
            if (msg.includes('(auth/email-already-in-use)')) msg = 'This email already has an account'
            Alert.alert(msg)
        }
    };

    // with no return unsubscribe the collection will never be made
    const savedPostCreation = (userCredential) => {
        const unsubscribe = db.collection('users').doc(userCredential.user.email)
            .collection('saved_post').add({
                saved_post_id: [],
                owner_email: userCredential.user.email
            }).then(() => navigation.navigate("Home"))

        return unsubscribe
    }

    const followersAndFollowingUserCreation = (userCredential) => {
        const unsubscribe = db.collection('users').doc(userCredential.user.email)
            .collection('following_followers').add({
                following: [],
                followers: [],
                owner_email: userCredential.user.email
            }).then(() => navigation.navigate("Home"))
        return unsubscribe
    }

    return (
        <Formik
            initialValues={{ name: '', email: '', password: '' }}
            onSubmit={(values) => {
                onSingin(values.email, values.password, values.name)
            }}
            validationSchema={SinginFormSchema}
            validateOnMount={true}
        >{({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched, setFieldTouched }) => (
            <View style={styles.form}>
                <View style={styles.input} >
                    <Text style={styles.inputLabel(theme)}>{t('screens.signup.text.username')}</Text>
                    <TextInput
                        style={[
                            styles.inputControl,
                            1 > values.name.length || values.name.length > 3
                                ? null // No error style if input is empty or valid
                                : styles.errorShadow(theme), // Apply error shadow if input is invalid
                            touched.name && errors.name && styles.errorShadow(theme)
                        ]}
                        placeholder={t('screens.signup.text.usernamePlaceholder')}
                        placeholderTextColor={colorPalette.dark.textPlaceholderSecondary}
                        value={values.name}
                        textContentType='name'
                        keyboardType='default'
                        autoFocus={true}
                        onFocus={() => {
                            setFieldTouched('name', true);
                        }}
                        onChangeText={(text) => {
                            // Replace spaces with empty string
                            const formattedText = text.replace(/\s/g, '');
                            handleChange('name')(formattedText);
                        }}
                        onBlur={() => {
                            handleBlur('name')
                        }}
                    />
                </View>
                <View style={styles.input} >
                    <Text style={styles.inputLabel(theme)}>{t('screens.signup.text.emailAddress')}</Text>
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[
                            styles.inputControl,
                            values.email.length < 1 || Validator.validate(values.email)
                                ? null // No error style if input is empty or valid
                                : styles.errorShadow(theme) // Apply error shadow if input is invalid
                        ]}
                        placeholder={t('screens.signup.text.emailAddressPlaceholder')}
                        placeholderTextColor={colorPalette.dark.textPlaceholderSecondary}
                        value={values.email}
                        textContentType='emailAddress'
                        keyboardType='email-address'
                        onChangeText={handleChange('email')}
                        onBlur={() => {
                            handleBlur('email')
                        }}
                    />
                </View>

                <View style={styles.input} >
                    <Text style={styles.inputLabel(theme)}>{t('screens.signup.text.password')}</Text>
                    <TextInput
                        style={[
                            styles.inputControl,
                            1 > values.password.length || values.password.length > 9
                                ? null // No error style if input is empty or valid
                                : styles.errorShadow(theme) // Apply error shadow if input is invalid
                        ]}
                        placeholder={t('screens.signup.text.password')}
                        placeholderTextColor={colorPalette.dark.textPlaceholderSecondary}
                        secureTextEntry={true}
                        value={values.password}
                        textContentType='password'
                        keyboardType='default'
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={handleChange('password')}
                        onBlur={() => {
                            handleBlur('password')
                        }}
                        onFocus={() => {
                            setFieldTouched('password', true);
                        }}
                    />
                    {touched.password && errors.password && (
                        <Text style={{ fontSize: 13, color: "tomato", margin: 10 }}>*{errors.password}</Text>
                    )}
                </View>

                <View style={styles.formAction}>
                    <TouchableOpacity onPress={handleSubmit} disabled={!isValid && Validator.validate(values.email)} activeOpacity={0.8}>
                        <View style={styles.btn(isValid, Validator, values, theme)}>
                            <Text style={styles.btnText}>{t('screens.signup.text.signup')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    // style={{ marginTop: "auto" }}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}>
                    <Text style={styles.formFooter(theme)}>{t('screens.signup.text.createAccount')}{' '}<Text style={{ textDecorationLine: "underline" }}>{t('screens.signup.text.login')}</Text> </Text>
                </TouchableOpacity>
            </View>
        )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    input: {
        marginTop: 16,
    },
    inputLabel: (theme) => ({
        fontSize: 17,
        fontWeight: "600",
        color: theme.textPrimary,
        marginBottom: 8,
    }),
    inputControl: {
        height: 44,
        backgroundColor: colorPalette.dark.Quaternary,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        color: colorPalette.dark.SubSecondary,
        borderWidth: 0.5,
        borderColor: 'transparent'
    },
    form: {
        marginBottom: 24,
        flex: 1
    },
    formAction: {
        marginVertical: 24,
    },
    btn: (isValid, Validator, values) => ({
        marginTop: 20,
        backgroundColor: isValid && Validator.validate(values.email) ? colorPalette.dark.Quinary : colorPalette.dark.textQuinary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: isValid ? colorPalette.dark.Quinary : colorPalette.dark.textQuinary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16
    }),
    btnText: {
        fontSize: 18,
        fontWeight: "600",
        color: colorPalette.dark.textPrimary
    },
    formFooter: (theme) => ({
        fontSize: 17,
        fontWeight: "600",
        color: theme.Primary === "#050505" ? theme.SubSecondary : theme.Tertiary,
        textAlign: "center",
        letterSpacing: 0.2,
        marginBottom: 30,
    }),
    errorShadow: (theme) => ({
        shadowColor: theme.Primary === "#050505" ? 'red' : 'tomato',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5, // For Android
        borderWidth: 0.5,
        borderColor: theme.Primary === "#050505" ? 'red' : 'tomato',
    }),
});
export default SinginForm