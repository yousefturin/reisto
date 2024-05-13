
import { Appearance } from 'react-native';

export const getColorForTheme = (value, selectedTheme, systemTheme) => {
    const theme = systemTheme ? Appearance.getColorScheme() === "dark"
        ? value.dark
        : value.light
        : selectedTheme === "dark"
            ? value.dark
            : value.light
    return theme;
};