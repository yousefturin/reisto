
import { TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { colorPalette } from '../../Config/Theme';


const FoodCategories = ({ setFieldValue, values, handleBlur }) => {
    const categories = [
        { name: 'Chicken' },
        { name: 'Chinese Dish' },
        { name: 'Italian Cuisine' },
        { name: 'Mexican Food' },
        { name: 'Vegetarian' },
        { name: 'Seafood' },
        { name: 'Indian Cuisine' },
        { name: 'Desserts' },
        { name: 'Salads' },
        { name: 'Pasta' },
        { name: 'BBQ' },
        { name: 'Soup' },
        { name: 'Sandwiches' },
    ];
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
    const handleCategoryPress = (index, categoryName) => {
        setSelectedCategoryIndex(index);
        setFieldValue('category', categoryName)
    };
    return (
        <>
            <Text style={{ color: colorPalette.dark.textPrimary, margin: 10, fontSize: 20, fontWeight: "700" }}>Category</Text>
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
                {categories.map((category, index) => (
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
                            }}>{category.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>

    )
}
export default FoodCategories