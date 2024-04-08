import { SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import { POSTS } from '../data/post/post'

import NavigationStack from '../components/Home/Navigation'
import { db, firebase } from '../firebase'
const HomeScreen = () => {
    
    const [activeButton, setActiveButton] = useState("Home");
    const [posts, setPosts] = useState([])
    const [userData, setUserData] = useState([])
    useEffect(() => {
        db.collectionGroup('posts').onSnapshot(snapshot => {
            const sortedPosts = snapshot.docs
                .map(doc => doc.data())
                .sort((a, b) => {
                    const timeA = a.createdAt.seconds * 1000000000 + a.createdAt.nanoseconds;
                    const timeB = b.createdAt.seconds * 1000000000 + b.createdAt.nanoseconds;
                    return timeB - timeA;
                });
            setPosts(sortedPosts);
        });
    }, [])
    useEffect(() => {
        getUsernameFromFirebase()
    }, [])
    const getUsernameFromFirebase = () => {
        const user = firebase.auth().currentUser
        // get the user name 
        const unsubscribe = db.collection('users').where('owner_uid', '==', user.uid).limit(1).onSnapshot(
            snapshot => snapshot.docs.map(doc => {
                setUserData({
                    username: doc.data().username,
                    profile_picture: doc.data().profile_picture,
                }
                )
            })
        )
        return unsubscribe
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505" }}>
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                {posts.map((post, index) => (
                    <Post post={post} key={index} userData={userData} />
                ))}
            </ScrollView>
            <NavigationStack userData={userData} activeButton={activeButton} />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({

});

export default HomeScreen