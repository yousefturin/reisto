import { SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import NavigationStack from '../components/Home/Navigation'
import { userData } from '../data/accountUser/myAccount'

const NotificationScreen = () => {
    const [activeButton, setActiveButton] = useState("Notification");
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505",justifyContent:"flex-end" }}>
            <NavigationStack userData={userData}  activeButton={activeButton}/>
        </SafeAreaView>
    )
}

export default NotificationScreen