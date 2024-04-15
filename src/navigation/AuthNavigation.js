import React, { useEffect, useState } from 'react'
import { AuthAppNavigator, UnAuthAppNavigator } from './AppNavigation'
import { firebase } from '../firebase'
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from '../context/UserDataProvider';
import LottieView from 'lottie-react-native';
import { Dimensions, Text, View } from 'react-native';
import SvgComponent from '../utils/SvgComponents';
import initializeScalingUtils from '../utils/NormalizeSize';

const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const DarkThemeNavigator = {
        colors: {
            primary: 'rgb(10, 132, 255)',
            background: '#050505',
            card: 'rgb(18, 18, 18)',
            text: 'rgb(229, 229, 231)',
            border: 'rgb(39, 39, 41)',
            notification: 'rgb(255, 69, 58)',
        },
    };
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user);
            setTimeout(() => {
                setLoading(false); // Change loading state after some time (simulation)
            }, 1500);
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []);
    // hide UnAuthAppNavigator flashing before Firebase check the user's authentication state
    const LoadingIndicator = () => {
        const { moderateScale } = initializeScalingUtils(Dimensions);
        return (
            <View style={{ flex: 1, backgroundColor: "#050505", }}>
                <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center", }}>
                    <LottieView source={require('./splash.json')} autoPlay loop style={{ width: moderateScale(150), height: moderateScale(150), }} />
                    <View style={{ marginLeft: 7, }}>
                        <SvgComponent svgKey="LogoSVG" width={moderateScale(100)} height={moderateScale(100)} fill={'#ffffff'} />
                    </View>
                </View>
            </View>
        );
    };
    if (loading) {
        return <LoadingIndicator />;
    }
    return (
        <NavigationContainer theme={DarkThemeNavigator}>
            {currentUser ?
                <UserProvider>
                    <AuthAppNavigator />
                </UserProvider>
                : <UnAuthAppNavigator />}
        </NavigationContainer>
    );
}

export default AuthNavigation