/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-elements';
import React from 'react'


const ThemeSelector = ({ theme, selectedTheme, toggleTheme, t }) => {
    const themes = [
        { label: t('screens.settingOption.theme.systemTheme'), value: 'system' },
        { label: t('screens.settingOption.theme.lightTheme'), value: 'light' },
        { label: t('screens.settingOption.theme.darkTheme'), value: 'dark' },
    ];

    const renderThemeItem = ({ item, index }) => (
        <>
            <TouchableOpacity
                style={{
                    padding: 14,
                    marginBottom: 10,
                    flexDirection: "row-reverse",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 4
                }}
                onPress={() => {
                    if (selectedTheme !== item.value) {
                        toggleTheme(item.value);
                    }
                }}
                activeOpacity={0.7}
            >
                <View style={{
                    width: 24, // Set the size of the circle container
                    height: 24,
                    borderRadius: 50, // Make it a circle
                    borderWidth: 1, // Add a border
                    borderColor: '#add1f7', // Border color
                    marginRight: 10, // Spacing between the circle and text
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                    {selectedTheme === item.value && (
                        <View style={{
                            width: 14, // Set the size of the filled circle
                            height: 14,
                            borderRadius: 50, // Make it a circle
                            backgroundColor: '#add1f7',
                        }}></View>
                    )}
                </View>
                <Text style={{
                    paddingRight: 6,
                    fontSize: 16,
                    color: theme.textPrimary,
                }}>{item.label}</Text>
            </TouchableOpacity>
            {index !== themes.length - 1 && <Divider width={0.5} orientation='horizontal' color={theme.dividerTertiary} />}
        </>
    );
    
    return (
        <>
            <View style={{
                justifyContent: 'center',
                textAlign: 'right',
                alignItems: "flex-start",
                marginLeft: 20
            }}>
                <Text style={{
                    color: '#767676',
                    paddingTop: 15,
                    fontSize: 14
                }}>{t('screens.settingOption.theme.theme')}</Text>
            </View>
            <View style={{
                backgroundColor: theme.SubPrimary,
                borderRadius: 10,
                marginTop: 10,
                shadowColor: theme.Primary === '#050505' ? "black" : 'grey',
                shadowOffset: {
                    width: 0,
                    height: 2.2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                marginHorizontal: 20
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                }}>
                    <FlatList
                        data={themes}
                        renderItem={renderThemeItem}
                        keyExtractor={(item) => item.value}
                        extraData={selectedTheme}
                        scrollEnabled={false} // Set scrollEnabled to false to make it not scrollable
                    />
                </View>
            </View>
        </>
    )
}

export default ThemeSelector