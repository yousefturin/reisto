/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */



/**
 * Calculates the time difference between a given timestamp and the current time.
 * @param {Object} timestampObj - The Firestore timestamp object.
 * @param {Function} t - The translation function for retrieving localized strings.
 * @returns {string} - The calculated time difference in a human-readable format.
 */
function calculateTimeDifference(timestampObj, t) {
    // Convert Firestore timestamp to JavaScript Date object
    const targetTime = new Date((timestampObj.seconds * 1000) + (timestampObj.nanoseconds / 1000000));

    const currentTime = new Date();
    const differenceInMilliseconds = Math.abs(currentTime - targetTime);
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds}${t('screens.home.text.timeCalculation.second')}`;
    } else {
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 60) {
            return `${differenceInMinutes}${t('screens.home.text.timeCalculation.minute')}`;
        } else {
            const differenceInHours = Math.floor(differenceInMinutes / 60);
            if (differenceInHours < 24) {
                return `${differenceInHours}${t('screens.home.text.timeCalculation.hour')}`;
            } else {
                const differenceInDays = Math.floor(differenceInHours / 24);
                if (differenceInDays < 30) {
                    return `${differenceInDays}${t('screens.home.text.timeCalculation.day')}`;
                } else {
                    // If more than one month, return the date
                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                    return targetTime.toLocaleDateString(undefined, options);
                }
            }
        }
    }
}

export default calculateTimeDifference;
