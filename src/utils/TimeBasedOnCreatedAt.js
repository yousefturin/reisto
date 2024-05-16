/**
 * Calculates the creation time based on the provided time object.
 * @param {Object} timeObject - The time object containing the seconds and nanoseconds.
 * @returns {string} - The formatted time string in the format 'hh:mm AM/PM'.
 */
export const CalculateCreateAt = (timeObject) => {
    const { seconds, nanoseconds } = timeObject;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};