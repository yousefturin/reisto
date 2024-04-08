import { SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import NavigationStack from '../components/Home/Navigation'


const SearchScreen = () => {
    const [activeButton, setActiveButton] = useState("Search");
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#050505", justifyContent: "flex-end" }}>
            <NavigationStack userData={userData}  activeButton={activeButton}/>
        </SafeAreaView>
    )
}

export default SearchScreen