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