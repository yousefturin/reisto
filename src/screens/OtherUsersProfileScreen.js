import { ScrollView, SafeAreaView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ProfilePost from '../components/Profile/ProfilePost'
import { RefreshControl } from 'react-native-gesture-handler'
import { db, firebase } from '../firebase'
import OthersProfileHeader from '../components/OthersProfile/OthersProfileHeader'
import OthersProfileContent from '../components/OthersProfile/OthersProfileContent'

const OtherUsersProfileScreen = ({ route }) => {
    const { userDataToBeNavigated } = route.params
    const [userPosts, setUserPost] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [scrollToPostId, setScrollToPostId] = useState(null)

    useEffect(() => {
        fetchUserPosts();
    }, [])

    const fetchUserPosts = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            // this is a multi used component so now when from search it is id and from userData it is email and when now from post explore it is owner_email
            // this need ot be generalized to one variable.
            db.collection('users').doc(userDataToBeNavigated.id).collection('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
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
                <OthersProfileHeader userDataToBeNavigated={userDataToBeNavigated} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <OthersProfileContent userDataToBeNavigated={userDataToBeNavigated} userPosts={userPosts} />
                    <ProfilePost posts={userPosts} userDataToBeNavigated={userDataToBeNavigated} onPostPress={handlePostPress} keyValue={"NavigationToOtherProfile"} />
                </ScrollView>
            </>

        </SafeAreaView>
    )
}

export default OtherUsersProfileScreen
