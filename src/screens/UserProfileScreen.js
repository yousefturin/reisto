import { RefreshControl, SafeAreaView, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import ProfileHeader from '../components/Profile/ProfileHeader'
import { UserContext } from '../context/UserDataProvider'
import ProfileContent from '../components/Profile/ProfileContent'
import ProfilePost from '../components/Profile/ProfilePost'
import { colorPalette } from '../Config/Theme'

import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma'
import { Animated } from 'react-native'
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useFastPosts from '../hooks/useFastPosts'

const UserProfileScreen = () => {
    const { t } = useTranslation();
    const userData = useContext(UserContext);
    const [refreshing, setRefreshing] = useState(false);
    const { userPosts, loading, afterLoading, fetchUserSavedPosts } = useFastPosts(true, firebase.auth().currentUser.email)

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    const handleLogout = async () => {
        try {
            await firebase.auth().signOut()
            console.log("Singed out successfully!")
        } catch (error) {
            console.error(error)
        }
    }

    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const subscription = fetchUserSavedPosts();
        setRefreshing(false);
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, []);

    //#region  animated header
    const scrollY = new Animated.Value(0);
    const offsetAnimation = new Animated.Value(0);
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnimation,
        ),
        0,
        350,
    );
    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;
    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff, 0),
                350,
            );
        })
        offsetAnimation.addListener(({ value }) => {
            _offsetValue = value;
        });
    }, [])
    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, 350],
        outputRange: [0, -350],
        extrapolate: 'clamp',
    });
    const opacity = clampedScroll.interpolate({
        inputRange: [0, 40, 350],
        outputRange: [1, 0.1, 0],
        extrapolate: 'clamp',
    });
    const opacityContent = clampedScroll.interpolate({
        inputRange: [0, 130, 260],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    var scrollEndTimer = null
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > 350 && _clampedScrollValue > 350 / 2 ? _offsetValue + 350 : _offsetValue - 350;
        Animated.timing(offsetAnimation, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd, 250)
    }

    //#endregion

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <>
                <View style={{ position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: theme.Primary, height: 48, zIndex: 3, }}></View>
                <Animated.View style={{
                    backgroundColor: theme.Primary,
                    transform: [{ translateY: headerTranslate }],
                    position: 'absolute',
                    top: 40,
                    right: 0,
                    left: 0,
                    zIndex: 2,
                }}>
                    <ProfileHeader handleLogout={handleLogout} userData={userData} theme={theme} t={t} opacity={opacity} />
                </Animated.View>
                {/* need fix so that when the profile content is still in view then the divider should not be visible */}
                <Animated.ScrollView
                    style={{ paddingTop: 50, }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScrollEndDrag={onScrollEndDrag}
                    scrollEventThrottle={4}
                >
                    <ProfileContent userData={userData} userPosts={userPosts} theme={theme} t={t} opacityContent={opacityContent} />
                    {loading === false && (
                        <ProfilePost posts={userPosts} userData={userData} keyValue={"NavigationToMyProfile"} t={t} />
                    )}
                    {loading === true && (
                      <LoadingPlaceHolder theme={theme} /> 
                      
                    )}

                    {afterLoading === true && loading === false && (<View style={{ minHeight: 250, }}>
                        <EmptyDataParma SvgElement={"AddPostIllustration"} theme={theme} t={t} dataMessage={"You can share posts to tell your friends about your recipes."} TitleDataMessage={"Nothing shared yet"} />
                    </View>)}
                </Animated.ScrollView>
            </>
        </SafeAreaView>
    )
}

export default UserProfileScreen



