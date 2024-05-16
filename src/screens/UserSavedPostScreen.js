import { ScrollView, RefreshControl, SafeAreaView, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserDataProvider';
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder';
import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';

const UserSavedPostScreen = () => {
    const { t } = useTranslation();
    const userData = useContext(UserContext);
    const [savedPosts, setSavedPosts] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    useEffect(() => {
        const unsubscribe = fetchUserSavedPosts();

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    // fetching here is different from UserSavedPostTimeLineScreen because it does not need the profile image to be displayed.
    // the fetching might be change for better and faster process<<<<<<<<<<<-.
    const fetchUserSavedPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            const queryPost = db.collectionGroup('posts')
            const querySavedPost = db.collection('users').doc(user.email).collection('saved_post')
            // bring all posts from across users
            return queryPost.onSnapshot(querySnapshot => {
                // create an array and push all the post inside of it that will be used later for matching saved posts with posts that are fetched 
                const allPosts = [];
                querySnapshot.forEach(doc => {
                    allPosts.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // fetch user saved posts collection and bring the data 
                querySavedPost.get().then(snapshot => {
                    const savedPostDoc = snapshot.docs[0];
                    // if the data exist 
                    if (savedPostDoc) {
                        // get the ids array from the data 
                        const postIds = savedPostDoc.data().saved_post_id;
                        // if the array data and it is an array 
                        if (postIds && Array.isArray(postIds)) {
                            // filter from the posts array the once that has the same stored id 
                            const savedPostsData = allPosts.filter(post => postIds.includes(post.id));
                            if (savedPostsData.length === 0) {
                                setLoading(null);
                            } else {
                                console.log("Saved posts fetched successfully");
                                setSavedPosts(savedPostsData);
                                setLoading(false);
                            }
                        } else {
                            console.error('Invalid or empty post IDs array');
                        }
                    } else {
                        console.log('No saved post document found for the user');
                    }
                }).catch(error => {
                    console.error("Error fetching saved posts:", error);
                });
            })
        } else {
            console.error("No authenticated user found.");
            return () => { };

        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            fetchUserSavedPosts(); // Your function to fetch posts
        } catch (error) {
            console.error('Error refreshing posts:', error);
        }
        setRefreshing(false);
    }, []);

    const handlePostPress = (postId) => {
        setScrollToPostId(postId)
    }
    const savedPostHeader = t('screens.profile.profileSavedHeader')
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <>
                <SavedPostsHeader header={savedPostHeader} theme={theme} />
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
                    {loading === false ? (
                        <SavedPostsGrid posts={savedPosts} userData={userData} onPostPress={handlePostPress} navigateToScreen={"SavedPosts"} />
                    ) : loading === null ? (
                        <View style={{ minHeight: 800 }}>
                            <EmptyDataParma SvgElement={"BookmarkIllustration"} theme={theme} t={t} dataMessage={"You can save posts across Reisto and organize them into collections."} TitleDataMessage={"Nothing saved yet"} />
                        </View>

                    ) : (
                        <LoadingPlaceHolder theme={theme} />)}
                </ScrollView>
            </>

        </SafeAreaView>
    )
}


export default UserSavedPostScreen