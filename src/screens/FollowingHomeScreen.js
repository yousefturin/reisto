/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */
import { SafeAreaView, RefreshControl, FlatList, View, Animated } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import Post from '../components/Home/Post'
import { UserContext } from '../context/UserDataProvider'
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'

import UseCustomTheme from '../utils/UseCustomTheme'
import { Divider } from 'react-native-elements'
import useShare from '../hooks/useShare'

import useAnimation from '../hooks/useAnimation'
import FollowHomeHeader from '../components/FollowHome/FollowHomeHeader'
import { db, firebase } from '../firebase'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const FollowingHomeScreen = () => {
    const { usersForSharePosts, followingUsers } = useShare()
    const [posts, setPostFollowing] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { headerTranslate, opacity, scrollY, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag } = useAnimation(null, 65)
    const userData = useContext(UserContext);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    //#region Fetching Following Posts
    useEffect(() => {
        // Call fetchPost when the component mounts
        if (followingUsers.length !== 0) {
            const subscription = fetchContent();
            console.log("Subscribed to following posts.");
            // Return a cleanup function to unsubscribe when the component unmounts
            return () => {
                // Check if subscription object contains an unsubscribe function
                if (subscription && typeof subscription.unsubscribe === 'function') {
                    console.log("Unsubscribed from following posts.");
                    subscription.unsubscribe;
                } else {
                    console.log("Unsubscribed from following posts was unavailable.");
                }
            };
        }
    }, [followingUsers]);

    const fetchContent = async () => {
        const user = firebase.auth().currentUser;
        // Assign the listener and store the reference
        if (user) {
            const uIds = followingUsers.map(user => user.email);

            // since the uIds is an array of emails, we need to use 'in' instead of '=='
            return db.collectionGroup('posts').where('owner_email', 'in', uIds).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                const postsWithProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    try {
                        const userDoc = await db.collection('users').doc(dbPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbProfilePicture,
                            ...dbPostData
                        }
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        return {
                            id: post.id,
                            ...dbPostData // Fallback to original post data if user document fetch fails
                        }
                    }
                })
                Promise.all(postsWithProfilePictures).then(posts => {
                    setPostFollowing(posts)
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            }, error => {
                console.error("Error listening to document:", error);
                return () => { };
            })
        } else {
            console.error("No authenticated user found.");
            return () => { };
        }
    };
    //#endregion

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const subscription = fetchContent();
        setRefreshing(false);
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, []);

    const renderItemFollowing = useCallback(
        ({ item, index }) => (
            <Post
                shouldAddOffSet={true}
                theme={theme} post={item}
                key={index} i
                sLastPost={index === posts.length - 1}
                userData={userData}
                usersForSharePosts={usersForSharePosts} />

        ),
        [theme, userData, usersForSharePosts, posts.length]
    )

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
                <FollowHomeHeader theme={theme} opacity={opacity} />
            </Animated.View>

            {headerTranslate !== -65 && <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />}
            {posts.length !== 0 ? (
                <AnimatedFlatList
                    style={{ paddingTop: 50 }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps='handled'
                    data={posts}
                    renderItem={renderItemFollowing}
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
            ) : (
                <LoadingPlaceHolder theme={theme} isPaddingNeeded={true} />
            )}
        </SafeAreaView>
    )
}

export default FollowingHomeScreen