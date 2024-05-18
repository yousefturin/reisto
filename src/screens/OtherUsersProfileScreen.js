import { ScrollView, SafeAreaView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ProfilePost from '../components/Profile/ProfilePost'
import { RefreshControl } from 'react-native-gesture-handler'
import { db, firebase } from '../firebase'
import OthersProfileHeader from '../components/OthersProfile/OthersProfileHeader'
import OthersProfileContent from '../components/OthersProfile/OthersProfileContent'
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'

import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'

const OtherUsersProfileScreen = ({ route }) => {
    const { userDataToBeNavigated } = route.params
    const { t } = useTranslation()
    const [userPosts, setUserPost] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [_, setScrollToPostId] = useState(null)

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


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
            const query = db.collection('users').doc(userDataToBeNavigated.id)
                .collection('posts')
                .orderBy('createdAt', 'desc');
            // this is a multi used component so now when from search it is id and from userData it is email and when now from post explore it is owner_email
            // this need ot be generalized to one variable.
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
                <OthersProfileHeader userDataToBeNavigated={userDataToBeNavigated} theme={theme} />
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
                    <OthersProfileContent t={t} userDataToBeNavigated={userDataToBeNavigated} userPosts={userPosts} theme={theme} />
                    {/* i don't understand how this is working it must be userPosts.id?.length === 0 then it must show the profile without rendering the Loader */}
                    {userPosts.length !== 0 || userPosts.id?.length !== 0 ? (
                        <ProfilePost t={t} posts={userPosts} userDataToBeNavigated={userDataToBeNavigated} onPostPress={handlePostPress} keyValue={"NavigationToOtherProfile"} />
                    ) : (
                        <LoadingPlaceHolder condition={userPosts.length === 0} theme={theme} />
                    )}
                </ScrollView>
            </>
        </SafeAreaView>
    )
}

export default OtherUsersProfileScreen
