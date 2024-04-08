import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from "firebase/compat/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import "firebase/compat/storage";

const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID
} = Constants.expoConfig.extra;
// Initialize Firebase

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
}
// getReactNativePersistence was pain in the ass to keep teh user logged in 2 day were spent
initializeAuth(firebase.initializeApp(firebaseConfig), {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = firebase.firestore()
export { firebase, db } 