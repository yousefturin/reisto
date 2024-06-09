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
