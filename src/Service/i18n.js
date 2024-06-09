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
