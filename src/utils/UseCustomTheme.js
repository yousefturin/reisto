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