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
// Desc: Theme configuration for the app



export const colorPalette = {
    light: {
        // colors related to backgrounds
        Primary: '#fefffe',
        SubPrimary: '#EFEFEF',
        Secondary: '#f2f2f7',
        SubSecondary: '#fefffe',
        Tertiary: '#dddddd',
        Quaternary: '#F8F8FC',
        Quinary: '#f2f2f7',

        // colors related to texts
        textPrimary: '#000',
        textSubPrimary: '#000',
        textSecondary: '#8E8E93',
        textTertiary: '#656565',
        textQuaternary: '#515151',
        textQuinary: '#b2b2b9',
        textError: '#ed4535',
        textURL: '#5d90d0',

        // colors related to buttonsD
        btnPrimary: '#515151',

        // colors related to placeholder
        textPlaceholder: '#D3D3D6',
        textPlaceholderSecondary: '#D3D3D6',

        //colors related to modal
        modalBackgroundPrimary: '#2b2b2b',
        modalBtn: '#e3e3e3',
        modalDivider: '#d6d6df',
        notch: "#b2b2b9",

        // colors related to divider
        dividerPrimary: "rgba(198, 198, 200, 0.45)",
        dividerSecondary: "rgba(198, 198, 200, 0.45)",
        dividerTertiary: '#e3e3e3',

        // colors related to app main colors
        appPrimary: '#007AFF',
        appSubPrimary: '#1c87fc',
        appSecondary: '#add1f7',

        appGradientPrimary: '#7e9bdf',
        appGradientSecondary: '#6581B7',
        appGradientTertiary: '#445379',

        appGradientPrimary2: '#526591',
        appGradientSecondary2: '#304062',
        appGradientTertiary2: '#2D3751',

        appInactiveGradientPrimary: '#bebebe',
        appInactiveGradientSecondary: '#727272',
        appInactiveGradientTertiary: '#4c4c4c',
    },
    dark: {
        // colors related to backgrounds
        Primary: '#050505',
        SubPrimary: '#262626',
        Secondary: '#2b2b2b',
        SubSecondary: '#222',
        Tertiary: '#383838',
        Quaternary: '#F8F8FC',
        Quinary: '#1C1C1E',

        // colors related to texts
        textPrimary: '#ffffff',
        textSubPrimary: '#f2f2f7',
        textSecondary: '#8E8E93',
        textTertiary: '#656565',
        textQuaternary: '#dddddd',
        textQuinary: '#b2b2b9',
        textError: '#ed4535',
        textURL: '#d8e0fa',

        // colors related to buttons
        btnPrimary: '#515151',

        // colors related to placeholder
        textPlaceholder: '#383838',
        textPlaceholderSecondary: '#D3D3D6',

        //colors related to modal
        modalBackgroundPrimary: '#2b2b2b',
        modalBtn: '#4c4c4c',
        modalDivider: '#575757',
        notch: "#727272",

        // colors related to divider
        dividerPrimary: '#2b2b2b',
        dividerSecondary: '#383838',
        dividerTertiary: '#383838',

        // colors related to app main colors
        appPrimary: '#007AFF',
        appSubPrimary: '#1c87fc',
        appSecondary: '#add1f7',

        appGradientPrimary: '#7e9bdf',
        appGradientSecondary: '#6581B7',
        appGradientTertiary: '#445379',

        appGradientPrimary2: '#526591',
        appGradientSecondary2: '#304062',
        appGradientTertiary2: '#2D3751',

        appInactiveGradientPrimary: '#bebebe',
        appInactiveGradientSecondary: '#727272',
        appInactiveGradientTertiary: '#4c4c4c',

    }
}

export const DarkThemeNavigator = {
    colors: {
        primary: 'rgb(10, 132, 255)',
        background: '#050505',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
    },
};
export const LightThemeNavigator = {
    colors: {
        primary: 'rgb(10, 132, 255)',
        background: '#fefffe',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
    },
};