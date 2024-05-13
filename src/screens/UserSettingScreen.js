import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';
import { Divider } from 'react-native-elements';
import { colorPalette } from '../Config/Theme';

const UserSettingScreen = () => {
    const themes = [
        { label: 'System Theme', value: 'system' },
        { label: 'Light Theme', value: 'light' },
        { label: 'Dark Theme', value: 'dark' },
    ];
    const { selectedTheme, toggleTheme } = useTheme();
    const systemTheme = selectedTheme === 'system';

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
                    borderRadius: 11, // Make it a circle
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
                            borderRadius: 7, // Make it a circle
                            backgroundColor: '#add1f7',
                        }}></View>
                    )}
                </View>
                <Text style={{
                    paddingRight: 6,
                    fontSize: 16,
                    color: '#ffffffff',
                }}>{item.label}</Text>
            </TouchableOpacity>
            {index !== themes.length - 1 && <Divider width={0.5} orientation='horizontal' color={colorPalette.dark.modalDivider} />}
        </>
    );
    return (
        <SafeAreaView>
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
                }}>Theme</Text>
            </View>
            <View style={{
                backgroundColor: "#262626",
                borderRadius: 10,
                marginTop: 10,
                shadowColor: "black",
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
        </SafeAreaView>
    )
}

export default UserSettingScreen