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