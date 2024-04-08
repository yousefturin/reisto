import React, { useEffect, useState } from 'react'
import { AuthAppNavigator, UnAuthAppNavigator } from './AppNavigation'
import { firebase } from '../firebase'
import { NavigationContainer } from "@react-navigation/native";

const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const userHandler = user => user ? setCurrentUser(user) : setCurrentUser(null)
    const DarkThemeNavigator = {
        colors: {
            primary: 'rgb(10, 132, 255)',
            background: '#111111',
            card: 'rgb(18, 18, 18)',
            text: 'rgb(229, 229, 231)',
            border: 'rgb(39, 39, 41)',
            notification: 'rgb(255, 69, 58)',
        },
    };
    useEffect(
        () =>
            firebase.auth().onAuthStateChanged((user) => {
                userHandler(user)
                setLoading(false)
            }), [])
    if (loading) {
        // hide UnAuthAppNavigator flashing before Firebase check the user's authentication state
        return null; 
    }
    return (
        <NavigationContainer theme={DarkThemeNavigator}>
            {currentUser ? <AuthAppNavigator /> : <UnAuthAppNavigator />}
        </NavigationContainer>
    );
}

export default AuthNavigation