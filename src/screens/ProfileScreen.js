import { Button, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import NavigationStack from '../components/Home/Navigation'

import { firebase } from '../firebase'

const ProfileScreen = () => {
    const [activeButton, setActiveButton] = useState("Profile");
    const handleLogout = async () => {
        try {
            await firebase.auth().signOut()
            console.log("Singed out successfully!")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505", justifyContent: "flex-end" }}>
            <Button title='Logout' onPress={handleLogout} />
            <NavigationStack userData={userData} activeButton={activeButton} />
        </SafeAreaView>
    )
}

export default ProfileScreen