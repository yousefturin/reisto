import { Dimensions, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
const windowHeight = Dimensions.get('window').height;

const SearchExplorePostTimeLineScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData, scrollToPostId } = route.params;
    const [posts, setPosts] = useState([])
    const flatListRef = useRef();
    const [initialScrollIndex, setInitialScrollIndex] = useState(null);
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);
    const [loading, setLoading] = useState(true)
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    const handleScrollToIndexFailed = info => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
    };
    useEffect(() => {
        // Calculate initialScrollIndex only when posts are fetched
        if (scrollToPostId && posts.length > 0) {
            const index = posts.findIndex(post => post.id === scrollToPostId);
            if (index !== -1) {
                setInitialScrollIndex(index);
                if (flatListRef.current) {
                    // Scroll to the initial index
                    flatListRef.current.scrollToIndex({ animated: true, index });
                }
            }
        }
    }, [posts, scrollToPostId]);

    useEffect(() => {
        let unsubscribe
        const fetchPost = () => {
            const query = db.collectionGroup('posts').orderBy('createdAt', 'desc');

            // get the id of each post, and destructure the posts then order them based on createdAt as desc
            unsubscribe = query.onSnapshot(snapshot => {
                const postsWithProfilePictures = snapshot.docs.map(async post => {
                    const dbPostData = post.data();
                    if (dbPostData.length === 0) { setLoading(null); return }
                    try {
                        const userDoc = await db.collection('users').doc(dbPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbProfilePicture = dbUserData.profile_picture
                        return {
                            id: post.id,
                            profile_picture: dbProfilePicture, // this is work the picture is from the current logged in user not the one that is mapped to the post!
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
                    setPosts(posts)
                    setLoading(false);
                }).catch(error => {
                    console.error('Error fetching posts with profile pictures:', error);
                })
            });
        };
        fetchPost();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    useLayoutEffect(() => {
        if (loading !== null) {
            fetchData();
        }
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
    // this is only for testing the UI,UX and it will be changed for random posts to be displayedF


    const renderItem = ({ item }) => (
        <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
    )


    const searchHeader = t('screens.profile.profileSavedPostsTimeLineHeader')
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <SavedPostsHeader header={searchHeader} theme={theme} />
            {loading === false ? (
                <FlatList
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    initialScrollIndex={initialScrollIndex}
                    // this is a trick to allow the user to scroll, it needs more test to see if those values will work on
                    // different devices the same way to remove the drop fame.
                    getItemLayout={(data, index) => ({ length: windowHeight * 0.736, offset: windowHeight * 0.736 * index, index })}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                />
            ) : loading === null ? (
                <View style={{ minHeight: 800 }}>
                {/* needs change to as if any error happened then show an error message */}
                    <EmptyDataParma SvgElement={"BookmarkIllustration"} theme={theme} t={t} dataMessage={"You can save posts across Reisto and organize them into collections."} TitleDataMessage={"Nothing saved yet"} />
                </View>
            ) : (
                <LoadingPlaceHolder theme={theme} />
            )}
        </SafeAreaView>
    )
}

export default SearchExplorePostTimeLineScreen



