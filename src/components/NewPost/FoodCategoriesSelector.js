
import { TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { colorPalette } from '../../Config/Theme';


const FoodCategories = ({ setFieldValue, values, handleBlur, t }) => {
    const categories = [
        { name: 'Chicken', value: t('screens.sharePost.categoriesValue.chicken') },
        { name: 'Chinese Dish', value: t('screens.sharePost.categoriesValue.chineseDish') },
        { name: 'Italian Cuisine', value: t('screens.sharePost.categoriesValue.italianCuisine') },
        { name: 'Mexican Food', value: t('screens.sharePost.categoriesValue.mexicanFood') },
        { name: 'Vegetarian', value: t('screens.sharePost.categoriesValue.vegetarian') },
        { name: 'Seafood', value: t('screens.sharePost.categoriesValue.seafood') },
        { name: 'Indian Cuisine', value: t('screens.sharePost.categoriesValue.indianCuisine') },
        { name: 'Desserts', value: t('screens.sharePost.categoriesValue.desserts') },
        { name: 'Salads', value: t('screens.sharePost.categoriesValue.salads') },
        { name: 'Pasta', value: t('screens.sharePost.categoriesValue.pasta') },
        { name: 'BBQ', value: t('screens.sharePost.categoriesValue.bbq') },
        { name: 'Soup', value: t('screens.sharePost.categoriesValue.soup') },
        { name: 'Sandwiches', value: t('screens.sharePost.categoriesValue.sandwiches') },
        { name: 'Burgers', value: t('screens.sharePost.categoriesValue.burgers') },
        { name: 'Pizza', value: t('screens.sharePost.categoriesValue.pizza') },
        { name: 'Sushi', value: t('screens.sharePost.categoriesValue.sushi') },
        { name: 'Tacos', value: t('screens.sharePost.categoriesValue.tacos') },
        { name: 'Curries', value: t('screens.sharePost.categoriesValue.curries') },
        { name: 'Wraps', value: t('screens.sharePost.categoriesValue.wraps') },
        { name: 'Tapas', value: t('screens.sharePost.categoriesValue.tapas') },
        { name: 'Rice Dishes', value: t('screens.sharePost.categoriesValue.riceDishes') },
        { name: 'Stir-fry', value: t('screens.sharePost.categoriesValue.stirFry') },
        { name: 'Smoothies', value: t('screens.sharePost.categoriesValue.smoothies') },
        { name: 'Cakes', value: t('screens.sharePost.categoriesValue.cakes') },
        { name: 'Pastries', value: t('screens.sharePost.categoriesValue.pastries') },
        { name: 'Ice Cream', value: t('screens.sharePost.categoriesValue.iceCream') },
        { name: 'Tofu Dishes', value: t('screens.sharePost.categoriesValue.tofuDishes') },
    ];
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
                            }}>{category.value}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>

    )
}
export default FoodCategories