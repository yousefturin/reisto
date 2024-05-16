import { getColorForTheme } from "./ThemeUtils";

/**
 * Returns a custom theme based on the selected theme and color palettes.
 * @param {Object} options - The options for customizing the theme.
 * @param {string} options.selectedTheme - The selected theme ("system" or a specific theme).
 * @param {Object} options.colorPaletteDark - The color palette for the dark theme.
 * @param {Object} options.colorPaletteLight - The color palette for the light theme.
 * @returns {Object} - The custom theme object.
 */
export default useCustomTheme = (selectedTheme, { colorPaletteDark, colorPaletteLight }) => {
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPaletteDark, light: colorPaletteLight },
        selectedTheme,
        systemTheme
    );
    return theme;
};