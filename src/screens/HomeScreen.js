import { SafeAreaView, RefreshControl, FlatList, View, Text, Dimensions, Animated, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback, useContext, useLayoutEffect } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase'
import { UserContext } from '../context/UserDataProvider'
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'

import { StatusBar } from 'react-native'
import UseCustomTheme from '../utils/UseCustomTheme'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize'
import { Divider } from 'react-native-elements'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPostFYP] = useState([])
    const [postFollowing, setPostFollowing] = useState([])
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const [isFollowingData, setIsFollowingData] = useState(false)
    const [postOptionModal, setPostOptionModal] = useState(false)
    const [textForPostOption, setTextForPostOption] = useState("Following")
    const [SvgForPostOption, setSvgForPostOption] = useState("followingSVG")

    const userData = useContext(UserContext);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    // statusBarColorTheme is move from auth to give access to the theme values and based on that the status bar color will be changed
    const statusBarColorTheme = UseCustomTheme(selectedTheme, { colorPaletteDark: "light-content", colorPaletteLight: "dark-content" })

    //#region Fetching Posts
    useEffect(() => {
        // Call fetchPost when the component mounts
        const unsubscribe = fetchPost();
        console.log("Subscribed to posts.");
        // Return a cleanup function to unsubscribe when the component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
                console.log("Unsubscribed from posts.");
            }
        };
    }, []);

    const fetchPost = useCallback(() => {
        const user = firebase.auth().currentUser;
        // Assign the listener and store the reference
        if (user) {
            return db.collectionGroup('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
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
                    setPostFYP(posts)
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            });
        } else {
            console.error("No authenticated user found.");
            return null; // Return null if user is not authenticated
        }
    }, []);
    //#endregion

    //#region Fetching Following Posts
    useEffect(() => {
        // Call fetchPost when the component mounts
        if (followingUsers.length !== 0) {
            const unsubscribe = fetchContent();
            console.log("Subscribed to following posts.");
            // Return a cleanup function to unsubscribe when the component unmounts
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                    console.log("Unsubscribed from following posts.");
                }
            };
        }
    }, [fetchContent, followingUsers]);

    const fetchContent = () => {
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
        })
    };
    //#endregion

    // this function need a fix for cleanup after mount
    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            // Fetch posts again
            const unsubscribe = fetchPost();
            console.log("Refreshing posts...");
            // Return a cleanup function to unsubscribe when the fetch is done
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                    console.log("Unsubscribed from posts after refreshing.");
                }
            };
        } catch (error) {
            console.error('Error refreshing posts:', error);
            return () => { };
        } finally {
            setTimeout(() => setRefreshing(false), 1000);
        }
    }, [fetchPost]);

    //#region Fetching Messages
    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(firebase.auth().currentUser.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = [];
                const fetchPromisesSecond = [];

                for (const follower of data.followers) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];
                const uniqueUserIds = new Set();
                const filteredUsersData = allUsersData.filter(user => {
                    if (uniqueUserIds.has(user.owner_uid)) {
                        return false;
                    } else {
                        uniqueUserIds.add(user.owner_uid);
                        return true;
                    }
                });
                setFollowingUsers(followingData);
                setUsersForSharePosts(filteredUsersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    //#endregion

    const handleShowPostOptions = () => {
        setPostOptionModal(!postOptionModal)
    }

    const handleDataToBeShown = () => {
        setIsFollowingData(!isFollowingData)
        setPostOptionModal(false)
        if (isFollowingData === false) {
            setTextForPostOption("For you")
            setSvgForPostOption("forYouSVG")
        } else {
            setTextForPostOption("Following")
            setSvgForPostOption("followingSVG")
        }
    }

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
        65,
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
                65,
            );
        })
        offsetAnimation.addListener(({ value }) => {
            _offsetValue = value;
        });
    }, [])
    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, 65],
        outputRange: [0, -65],
        extrapolate: 'clamp',
    });
    const opacity = clampedScroll.interpolate({
        inputRange: [0, 40, 65],
        outputRange: [1, 0.1, 0],
        extrapolate: 'clamp',
    });

    var scrollEndTimer = null
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > 65 && _clampedScrollValue > 65 / 2 ? _offsetValue + 65 : _offsetValue - 60;
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
    
    const renderItemFollowing = useCallback(
        ({ item, index }) => (
            <Post
                shouldAddOffSet={true}
                theme={theme} post={item}
                key={index} i
                sLastPost={index === postFollowing.length - 1}
                userData={userData}
                usersForSharePosts={usersForSharePosts} />

        ),
        [theme, userData, usersForSharePosts, postFollowing.length]
    )

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
            {postOptionModal && <TouchableOpacity activeOpacity={0.8} onPress={() => handleDataToBeShown()} style={{
                position: "absolute",
                top: 100, left: 20, backgroundColor: theme.Secondary,
                width: 150, zIndex: 9999, justifyContent: "space-around",
                alignItems: "center", borderRadius: 10, flexDirection: "row", paddingVertical: 10, shadowColor: theme.modalBackgroundPrimary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 12.84, elevation: 5
            }}>
                <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "500" }}>{textForPostOption}</Text>
                <SvgComponent svgKey={SvgForPostOption} width={moderateScale(24)} height={moderateScale(24)} stroke={theme.textPrimary} />
            </TouchableOpacity>}

            {isFollowingData === false ?
                posts.length !== 0 ? (
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
                ) : (
                    <LoadingPlaceHolder theme={theme} isPaddingNeeded={true} />
                ) : postFollowing.length !== 0 ? (
                    <AnimatedFlatList
                        style={{ paddingTop: 50 }}
                        onScrollBeginDrag={() => postOptionModal === true && setPostOptionModal(false)}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps='handled'
                        data={postFollowing}
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
            <StatusBar
                barStyle={statusBarColorTheme}
            />
        </SafeAreaView>
    )
}


export default HomeScreen