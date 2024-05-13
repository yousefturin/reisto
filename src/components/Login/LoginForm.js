import React from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Validator from 'email-validator'
import { firebase } from '../../firebase';
import { colorPalette } from '../../Config/Theme'

const LoginForm = ({ navigation, theme }) => {
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
                    <Text style={styles.inputLabel(theme)}>Email address</Text>
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[
                            styles.inputControl,
                            values.email.length < 1 || Validator.validate(values.email)
                                ? null // No error style if input is empty or valid
                                : styles.errorShadow(theme) // Apply error shadow if input is invalid
                        ]}
                        placeholder='john@example.com'
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
                    <Text style={styles.inputLabel(theme)}>Password</Text>
                    <TextInput
                        style={[
                            styles.inputControl,
                            1 > values.password.length || values.password.length > 9
                                ? null // No error style if input is empty or valid
                                :styles.errorShadow(theme), // Apply error shadow if input is invalid
                        ]}
                    placeholder='password'
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
                            <Text style={styles.btnText}>Log in</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    // style={{ marginTop: "auto" }}
                    onPress={() => {
                        navigation.navigate("Signup");
                    }}>
                    <Text style={styles.formFooter(theme)}>Don't have an account? <Text style={{ textDecorationLine: "underline" }}>Sign up</Text> </Text>
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