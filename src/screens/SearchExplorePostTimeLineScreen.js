import { Dimensions, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Post from '../components/Home/Post'
import { db, firebase } from '../firebase';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
const windowHeight = Dimensions.get('window').height;

const SearchExplorePostTimeLineScreen = ({ route }) => {
    const { userData, scrollToPostId } = route.params;
    const [posts, setPosts] = useState([])
    const flatListRef = useRef();
    const [initialScrollIndex, setInitialScrollIndex] = useState(null);
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
        const unsubscribe = fetchPost();

        // Return cleanup function to unsubscribe when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    // this is only for testing the UI,UX and it will be changed for random posts to be displayedF
    const fetchPost = () => {
        const query = db.collectionGroup('posts').orderBy('createdAt', 'desc');

        // get the id of each post, and destructure the posts then order them based on createdAt as desc
        return query.onSnapshot(snapshot => {
            const postsWithProfilePictures = snapshot.docs.map(async post => {
                const dbPostData = post.data();
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
            }).catch(error => {
                console.error('Error fetching posts with profile pictures:', error);
            })
        });
    };

    const renderItem = ({ item }) => (
        <Post post={item} userData={userData} />
    )



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <SavedPostsHeader header={"All Posts"} />
            {posts.length !== 0 ? (
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
            ) : (
                <LoadingPlaceHolder />
            )}
        </SafeAreaView>
    )
}

export default SearchExplorePostTimeLineScreen



