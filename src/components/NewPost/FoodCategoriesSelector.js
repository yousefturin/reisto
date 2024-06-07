/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { colorPalette } from '../../Config/Theme';
import { categories } from '../../Config/Constants';

const FoodCategories = ({ setFieldValue, values, handleBlur, t }) => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

    const handleCategoryPress = (index, categoryName) => {
        setSelectedCategoryIndex(index);
        setFieldValue('category', categoryName)
    };
    
    return (
        <>
            <Text style={{ color: colorPalette.dark.textPrimary, margin: 10, fontSize: 20, fontWeight: "700" }}>{t('screens.sharePost.category')}</Text>
            <ScrollView
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                }}
            >
                {categories(t).map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        value={values.category}
                        onPress={() => handleCategoryPress(index, category.name)}
                        onBlur={() => {
                            handleBlur('category')
                        }}>

                        <LinearGradient
                            // Button Linear Gradient
                            colors={selectedCategoryIndex == index ?
                                [colorPalette.dark.appGradientPrimary2, colorPalette.dark.appGradientSecondary2, colorPalette.dark.appGradientTertiary2]
                                :
                                [colorPalette.dark.appGradientPrimary, colorPalette.dark.appGradientSecondary, colorPalette.dark.appGradientTertiary]}
                            style={{
                                width: 100,
                                height: 40,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 5,
                            }}>
                            <Text style={{
                                color: colorPalette.dark.textPrimary,
                                textAlign: 'center',
                            }}>{category.value}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>

    )
}
export default FoodCategories