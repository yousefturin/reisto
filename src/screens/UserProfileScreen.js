import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import ProfileHeader from '../components/Profile/ProfileHeader'
import { UserContext } from '../context/UserDataProvider'
import ProfileContent from '../components/Profile/ProfileContent'
import ProfilePost from '../components/Profile/ProfilePost'
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { getColorForTheme } from '../utils/ThemeUtils'
import { useTheme } from '../context/ThemeContext'

const UserProfileScreen = () => {
    const userData = useContext(UserContext);
    const [userPosts, setUserPost] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [scrollToPostId, setScrollToPostId] = useState(null)

    const { selectedTheme } = useTheme();
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPalette.dark, light: colorPalette.light },
        selectedTheme,
        systemTheme
    );
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
                setUserPost(snapshot.docs.map(post => ({
                    id: post.id,
                    ...post.data()
                })))
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
                <ProfileHeader handleLogout={handleLogout} userData={userData} theme={theme} />
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
                    <ProfileContent userData={userData} userPosts={userPosts} theme={theme} />
                    {userPosts.length !== 0 || userPosts.id?.length !== 0 ? (
                        <ProfilePost posts={userPosts} userData={userData} onPostPress={handlePostPress} keyValue={"NavigationToMyProfile"} />
                    ) : (
                        <LoadingPlaceHolder condition={userPosts.length === 0} theme={theme} />
                    )}
                </ScrollView>
            </>
        </SafeAreaView>
    )
}

export default UserProfileScreen