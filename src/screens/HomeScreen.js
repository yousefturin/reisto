import { SafeAreaView, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import { db } from '../firebase'
import { UserContext } from '../context/UserDataProvider'


const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([])
    const userData = useContext(UserContext);


    useEffect(() => {
        fetchPost()
    }, [])
    const fetchPost = () => {
        // get the id of each post, and destructure the posts then order them based on createdAt as desc
        db.collectionGroup('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
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

    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            fetchPost(); // Your function to fetch posts
        } catch (error) {
            console.error('Error refreshing posts:', error);
        }
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <Header />
            <FlatList
                data={posts}
                renderItem={({ item, index }) => (
                    <Post post={item} key={index} isLastPost={index === posts.length - 1} userData={userData} />
                )}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={2}
                maxToRenderPerBatch={1}
                updateCellsBatchingPeriod={100}
                windowSize={7}
            />
        </SafeAreaView>
    )

}


export default HomeScreen