/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */



/**
 * Formats the given date into a string representation of the month and year.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted string representation of the month and year.
 */
export const formatCreatedAt = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    return `${month} ${year}`;
};