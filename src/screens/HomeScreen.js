/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { SafeAreaView, RefreshControl, FlatList, View, Text, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useContext } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import { UserContext } from '../context/UserDataProvider'
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'

import { StatusBar } from 'react-native'
import UseCustomTheme from '../utils/UseCustomTheme'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize'
import { Divider } from 'react-native-elements'
import useShare from '../hooks/useShare'
import usePosts from '../hooks/usePosts'
import useAnimation from '../hooks/useAnimation'
import { useNavigation } from '@react-navigation/native'
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma'
import { useTranslation } from 'react-i18next'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [postOptionModal, setPostOptionModal] = useState(false)
    const postOption = ({ Text: "Following", SVG: "followingSVG" })
    const { t } = useTranslation();
    
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const { usersForSharePosts } = useShare()
    const { posts, loading, fetchPosts } = usePosts("Home")
    const { headerTranslate, opacity, scrollY, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag } = useAnimation(null, 65)
    const userData = useContext(UserContext);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const navigation = useNavigation();

    // Move the declaration of statusBarColorTheme from the auth section to the HomeScreen component to give access to the theme values. Based on the selected theme, the status bar color will be changed.
    const statusBarColorTheme = UseCustomTheme(selectedTheme, { colorPaletteDark: "light-content", colorPaletteLight: "dark-content" })

    const handleShowPostOptions = () => {
        setPostOptionModal(!postOptionModal)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const subscription = fetchPosts();
        setRefreshing(false);
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, []);

    const renderItem = useCallback(
        ({ item, index }) => (
            <Post
                shouldAddOffSet={true}
                theme={theme}
                post={item}
                isLastPost={index === posts.length - 1}
                userData={userData}
                usersForSharePosts={usersForSharePosts}
            />
        ),
        [theme, userData, usersForSharePosts, posts.length]
    );

    const keyExtractor = useCallback((_, index) => index.toString(), []);

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: theme.Primary, }]}>
            <View style={{ position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: theme.Primary, height: 48, zIndex: 2, }}></View>
            <Animated.View style={{
                backgroundColor: theme.Primary,
                transform: [{ translateY: headerTranslate }],
                position: 'absolute',
                top: 40,
                right: 0,
                left: 0,
                zIndex: 1,
            }}>
                <Header theme={theme} onButtonClick={handleShowPostOptions} opacity={opacity} />
            </Animated.View>
            {headerTranslate !== -65 && <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />}
            {postOptionModal && <TouchableOpacity activeOpacity={0.8} onPress={() => {
                setPostOptionModal(false)
                navigation.navigate('FollowingHome')
            }} style={{
                position: "absolute",
                top: 100, left: 20, backgroundColor: theme.Secondary,
                width: 150, zIndex: 9999, justifyContent: "space-around",
                alignItems: "center", borderRadius: 10, flexDirection: "row", paddingVertical: 10, shadowColor: theme.modalBackgroundPrimary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 12.84, elevation: 5
            }}>
                <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "500" }}>{postOption.Text}</Text>
                <SvgComponent svgKey={postOption.SVG} width={moderateScale(24)} height={moderateScale(24)} stroke={theme.textPrimary} />
            </TouchableOpacity>}

            {loading === false ? (
                <AnimatedFlatList
                    style={{ paddingTop: 50 }}
                    onScrollBeginDrag={() => postOptionModal === true && setPostOptionModal(false)}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps='handled'
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}

                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollEndDrag={onScrollEndDrag}
                    scrollEventThrottle={4}
                />
            ) : loading === null ? (
                <View View style={{ minHeight: 800 }}>
                    <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} dataMessage={"Check your internet connection, and refresh the page."} TitleDataMessage={"Something went wrong"} />
                </View>
            ) : (
                <LoadingPlaceHolder theme={theme} isPaddingNeeded={true} /> 
            )
            }
            <StatusBar
                barStyle={statusBarColorTheme}
            />
        </SafeAreaView>
    )
}


export default HomeScreen