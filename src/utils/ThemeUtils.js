
import { Appearance } from 'react-native';

/**
 * Returns the color theme based on the provided parameters.
 *
 * @param {Object} value - The object containing the color values for both dark and light themes.
 * @param {string} selectedTheme - The selected theme ("dark" or "light").
 * @param {boolean} systemTheme - The flag indicating whether the system theme is enabled.
 * @returns {string} - The color theme based on the provided parameters.
 */
export const getColorForTheme = (value, selectedTheme, systemTheme) => {
    const theme = systemTheme ? Appearance.getColorScheme() === "dark"
        ? value.dark
        : value.light
        : selectedTheme === "dark"
            ? value.dark
            : value.light
    return theme;
};