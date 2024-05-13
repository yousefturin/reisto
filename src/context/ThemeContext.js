import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, AppState } from 'react-native';

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
            } catch (error) {
                console.error('Error fetching theme:', error);
                setSelectedTheme('system');
            } finally {

                setIsLoading(false); // Mark loading as complete
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
        // Return null while the theme is loading
        return null;
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
