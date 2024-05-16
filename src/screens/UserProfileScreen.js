import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
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
import { View } from 'moti'

const UserProfileScreen = () => {
    const { t } = useTranslation();
    const userData = useContext(UserContext);
    const [userPosts, setUserPost] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [scrollToPostId, setScrollToPostId] = useState(null)
    const [loading, setLoading] = useState(true);
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
    useEffect(() => {
        const unsubscribe = fetchUserPosts();
        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);


    const fetchUserPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            const query = db.collection('users').doc(user.email).collection('posts').orderBy('createdAt', 'desc');
            return query.onSnapshot(snapshot => {
                const userPostData = snapshot.docs.map(post => ({
                    id: post.id,
                    ...post.data()
                }))
                if (userPostData.length === 0) {
                    setLoading(null);
                } else {
                    console.log("User posts fetched successfully");
                    setUserPost(userPostData)
                    setLoading(false);
                }
            }, error => {
                console.error("Error fetching posts:", error);
            });
        }
        else {
            console.error("No authenticated user found.");
            return () => { };
        }
    };
    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            fetchUserPosts(); // Your function to fetch posts
        } catch (error) {
            console.error('Error refreshing posts:', error);
        }
        setRefreshing(false);
    }, []);
    const handlePostPress = (postId) => {
        setScrollToPostId(postId)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <>
                <ProfileHeader handleLogout={handleLogout} userData={userData} theme={theme} t={t} />
                <ScrollView
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <ProfileContent userData={userData} userPosts={userPosts} theme={theme} t={t} />
                    {loading === false ? (
                        <ProfilePost posts={userPosts} userData={userData} onPostPress={handlePostPress} keyValue={"NavigationToMyProfile"} t={t} />
                    ) : loading === null ? (
                        <View style={{ minHeight: 550 }}>
                            <EmptyDataParma SvgElement={"AddPostIllustration"} theme={theme} t={t} dataMessage={"You can share posts to tell your friends about your recipes."} TitleDataMessage={"Nothing shared yet"} />
                        </View>
                    ) :
                        null}
                    {/* null is placed instead of loadingPlaceHolder component to overcome the lag issue  */}

                    {/* (
                            <LoadingPlaceHolder condition={userPosts.length === 0} theme={theme} />
                        )} */}
                </ScrollView>
            </>
        </SafeAreaView>
    )
}

export default UserProfileScreen



