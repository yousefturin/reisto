import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../Locales/en.json';
import tr from '../Locales/tr.json';
import ru from '../Locales/ru.json';
import ar from '../Locales/ar.json';
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORE_LANGUAGE_KEY = "settings.lang";

const languageDetectorPlugin = {
    type: "languageDetector",
    async: true,
    init: () => { },
    detect: function (callback) {
        try {
            AsyncStorage.getItem(STORE_LANGUAGE_KEY).then((language) => {
                if (language) {
                    callback(language);
                } else {
                    callback("en");
                }
            }).catch((error) => {
                console.log("Error reading language", error);
            });
        } catch (error) {
            console.log("Error reading language", error);
        }
    },
    cacheUserLanguage: function (language) {
        try {
            AsyncStorage.setItem(STORE_LANGUAGE_KEY, language).catch((error) => {
                console.log("Error saving language", error);
            });
        } catch (error) {
            console.log("Error saving language", error);
        }
    },
};
const resources = {
    en: {
        translation: en,
    },
    tr: {
        translation: tr,
    },
    ru: {
        translation: ru,
    },
    ar:{
        translation: ar, 
    }
};

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;
