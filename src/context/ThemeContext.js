/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, AppState, SafeAreaView, Text } from 'react-native';

// Create a ThemeContext
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState("system"); // Start with a null state
    const [systemAppearance, setSystemAppearance] = useState(Appearance.getColorScheme());
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        async function fetchTheme() {
            try {
                const themeValue = await AsyncStorage.getItem('@selectedTheme');
                if (themeValue === 'dark' || themeValue === 'light' || themeValue === 'system') {
                    setSelectedTheme(themeValue); // Set the selected theme if it's "dark" or "light"
                } else {
                    const appearance = Appearance.getColorScheme();
                    setSelectedTheme('system');
                    setSystemAppearance(appearance || 'light'); // Set the theme based on the system appearance
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching theme:', error);
                setSelectedTheme('system');
            }
        }
        fetchTheme();
    }, []);

    // Toggle Theme
    const toggleTheme = (theme) => {
        setSelectedTheme(theme);
    };


    useEffect(() => {
        // Save the selected theme to AsyncStorage whenever it changes
        if (selectedTheme !== null) {
            AsyncStorage.setItem('@selectedTheme', selectedTheme);
        }
    }, [selectedTheme]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                const appearance = Appearance.getColorScheme();
                setSystemAppearance(appearance);
            }
        };

        AppState.addEventListener('change', handleAppStateChange);

        return () => {
            AppState.addEventListener('change', handleAppStateChange).remove();
        };
    }, []);

    if (isLoading) {
        // return null will cause the application to flicker when the theme is loading with the fallback color of the system theme
            // so even if the user selected the theme as dark and the device is light the flicker will be visible
            // on solution is to pass the loading state to teh authProvider that is having teh animation and instead of using timer base value it can use
            // the loading state to show the animation 
        return <SafeAreaView style={{ flex: 1, backgroundColor: systemAppearance === 'dark' ? "#050505" : "#fefffe" }}></SafeAreaView>;
    }


    return (
        <ThemeContext.Provider value={{ selectedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
