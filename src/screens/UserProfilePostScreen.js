import { Dimensions, FlatList, SafeAreaView, Text, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize';
import { db, firebase } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';


const { moderateScale } = initializeScalingUtils(Dimensions);
const windowHeight = Dimensions.get('window').height;

const UserProfilePostScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData, scrollToPostId } = route.params;
    const [posts, setPost] = useState([])
    const flatListRef = useRef();
    const [loading, setLoading] = useState(true);

    const [initialScrollIndex, setInitialScrollIndex] = useState(null);
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    const handleScrollToIndexFailed = info => {
        const offset = info.averageItemLength * info.index;
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 10);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };

    useEffect(() => {
        if (scrollToPostId && posts.length > 0) {
            const index = posts.findIndex(post => post.id === scrollToPostId);
            if (index !== -1) {
                setInitialScrollIndex(index);
            }
        }
    }, [scrollToPostId, posts]);

    useEffect(() => {
        if (initialScrollIndex !== null && !initialScrollDone) {
            flatListRef.current.scrollToIndex({
                index: initialScrollIndex,
                animated: true,
                viewPosition: 0
            });
            setInitialScrollDone(true);
        }
    }, [initialScrollIndex, initialScrollDone]);


    useEffect(() => {
        let unsubscribe;
        const fetchUserPosts = () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const query = db.collection('users').doc(user.email).collection('posts').orderBy('createdAt', 'desc');
                unsubscribe = query.onSnapshot(snapshot => {
                    const userPostsWithProfilePicture = snapshot.docs.map(async post => {
                        const dbUserPostData = post.data();
                        try {
                            const userDoc = await db.collection('users').doc(dbUserPostData.owner_email).get()
                            const dbUserData = userDoc.data()
                            const dbUserProfilePicture = dbUserData.profile_picture
                            return {
                                id: post.id,
                                profile_picture: dbUserProfilePicture,
                                ...dbUserPostData
                            }
                        } catch (error) {
                            console.error('Error fetching user document:', error)
                            return {
                                id: post.id,
                                ...dbUserPostData
                            }
                        }
                    })
                    Promise.all(userPostsWithProfilePicture).then(posts => {
                        setLoading(false)
                        setPost(posts)
                    }).catch(error => {
                        console.error('Error fetching posts with profile pictures:', error);
                        setLoading(null);
                    })
                }, error => {
                    console.error("Error fetching posts:", error);
                    setLoading(null);
                });
            }
            else {
                console.error("No authenticated user found.");
                return () => { };
            }
        };
        fetchUserPosts()
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);

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

                setUsersForSharePosts(filteredUsersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const renderItem = useCallback(({ item }) => {
        return (
            <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
        )
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <OwnerProfileHeader userData={userData} theme={theme} t={t} />
            {loading === false ? (
                    <VirtualizedList
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}
                        ref={flatListRef}
                        data={posts}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        initialScrollIndex={initialScrollIndex}
                        getItem={(data, index) => data[index]}
                        getItemCount={data => data.length}
                        getItemLayout={(_, index) => ({
                            length: (windowHeight - 100) * 0.84,
                            offset: (windowHeight - 110) * 0.84 * index,
                            index
                        })}
                        onScrollToIndexFailed={handleScrollToIndexFailed}
                    />
            ) : loading === null ? (
                <View style={{ minHeight: 800 }}>
                    <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} dataMessage={"Check your internet connection, and refresh the page."} TitleDataMessage={"Something went wrong"} />
                </View>
            ) : (
                <LoadingPlaceHolder theme={theme} />
            )
            }
        </SafeAreaView>
    )
}

const OwnerProfileHeader = ({ userData, theme, t }) => {
    const navigation = useNavigation();

    const handlePressBack = () => {
        navigation.goBack()
    }
    
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 12 }}>{userData.username.toUpperCase()}</Text>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.profile.profilePostHeader')}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default UserProfilePostScreen
