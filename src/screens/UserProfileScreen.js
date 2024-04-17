import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { db, firebase } from '../firebase'
import ProfileHeader from '../components/Profile/ProfileHeader'
import { UserContext } from '../context/UserDataProvider'
import ProfileContent from '../components/Profile/ProfileContent'
import ProfilePost from '../components/Profile/ProfilePost'
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder'

const UserProfileScreen = () => {
    const userData = useContext(UserContext);
    const [userPosts, setUserPost] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [scrollToPostId, setScrollToPostId] = useState(null)

    const handleLogout = async () => {
        try {
            await firebase.auth().signOut()
            console.log("Singed out successfully!")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUserPosts();
    }, [])

    const fetchUserPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            db.collection('users').doc(user.email).collection('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <>
                <ProfileHeader handleLogout={handleLogout} userData={userData} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <ProfileContent userData={userData} userPosts={userPosts} />
                    {userPosts.length !== 0 || userPosts.id?.length !== 0? (
                        <ProfilePost posts={userPosts} userData={userData} onPostPress={handlePostPress} keyValue={"NavigationToMyProfile"} />
                    ) : (
                        <LoadingPlaceHolder condition={userPosts.length === 0} />
                    )}
                </ScrollView>
            </>
        </SafeAreaView>
    )
}

export default UserProfileScreen