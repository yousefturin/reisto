/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import React from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Validator from 'email-validator'
import { firebase } from '../../firebase';
import { colorPalette } from '../../Config/Theme'
import { useTranslation } from 'react-i18next';

const LoginForm = ({ navigation, theme }) => {
    const { t } = useTranslation();

    const LoginFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        password: Yup.string()
            .required('')
            .min(8, 'Password must be at least 8 characters')
            .test(
                'contains-letter',
                'Password must contain at least one letter',
                value => /[A-Za-z]/.test(value)
            )
            .test(
                'contains-number',
                'Password must contain at least one number',
                value => /\d/.test(value)
            )
            .test(
                'contains-special-character',
                'Password must contain at least one special character',
                value => /[@$!%*#?&-]/.test(value)
            )
    });
    
    const onLogin = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            navigation.navigate("Home")
        } catch (error) {
            let msg = error.message
            if (msg.includes('(auth/invalid-credential)')) msg = 'Invalid email or password'
            if (msg.includes('(auth/user-not-found)')) msg = 'User not found'
            if (msg.includes('(auth/too-many-requests)')) msg = 'Too many requests. Try again later'
            if (msg.includes('(auth/network-request-failed)')) msg = 'Network error. Try again later'
            Alert.alert(msg)
        }
    }
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values) => {
                onLogin(values.email, values.password)
            }}
            validationSchema={LoginFormSchema}
            validateOnMount={true}
        >{({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched, setFieldTouched }) => (
            <View style={styles.form}>
                <View style={styles.input} >
                    <Text style={styles.inputLabel(theme)}>{t('screens.login.text.emailAddress')}</Text>
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[
                            styles.inputControl,
                            values.email.length < 1 || Validator.validate(values.email)
                                ? null // No error style if input is empty or valid
                                : styles.errorShadow(theme) // Apply error shadow if input is invalid
                        ]}
                        placeholder={t('screens.login.text.emailAddressPlaceholder')}
                        placeholderTextColor={colorPalette.dark.textPlaceholderSecondary}
                        value={values.email}
                        textContentType='emailAddress'
                        keyboardType='email-address'
                        autoFocus={true}
                        onChangeText={handleChange('email')}
                        onBlur={() => {
                            handleBlur('email')
                        }}
                    />
                </View>

                <View style={styles.input} >
                    <Text style={styles.inputLabel(theme)}>{t('screens.login.text.password')}</Text>
                    <TextInput
                        style={[
                            styles.inputControl,
                            1 > values.password.length || values.password.length > 9
                                ? null // No error style if input is empty or valid
                                :styles.errorShadow(theme), // Apply error shadow if input is invalid
                        ]}
                    placeholder={t('screens.login.text.password')}
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
                            <Text style={styles.btnText}>{t('screens.login.text.login')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    // style={{ marginTop: "auto" }}
                    onPress={() => {
                        navigation.navigate("Signup");
                    }}>
                    <Text style={styles.formFooter(theme)}>{t('screens.login.text.createAccount')}{' '}<Text style={{ textDecorationLine: "underline" }}>{t('screens.login.text.signup')}</Text> </Text>
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
    btn: (isValid, Validator, values, theme) => ({
        marginTop: 20,
        backgroundColor: isValid && Validator.validate(values.email) ? colorPalette.dark.Quinary : colorPalette.dark.textQuinary,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: isValid ? theme.Quinary : theme.textQuinary,
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
export default LoginForm