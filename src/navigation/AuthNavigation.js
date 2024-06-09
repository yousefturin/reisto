/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import React, { useEffect, useState } from 'react'
import { AuthAppNavigator, UnAuthAppNavigator } from './AppNavigation'
import { firebase } from '../firebase'
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from '../context/UserDataProvider';
import LottieView from 'lottie-react-native';
import { Dimensions, View, useColorScheme } from 'react-native';
import SvgComponent from '../utils/SvgComponents';
import initializeScalingUtils from '../utils/NormalizeSize';
import { MessagesNumProvider } from '../context/MessagesNumProvider';
import { ThemeProvider } from '../context/ThemeContext';
import { DarkThemeNavigator, LightThemeNavigator } from '../Config/Theme';
import '../Service/i18n';

const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const theme = useColorScheme();

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
            <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#050505' : '#fefffe' }}>
                <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center", }}>
                    <LottieView source={require('./splash.json')} autoPlay loop style={{ width: moderateScale(150), height: moderateScale(150), }} />
                    <View style={{ marginLeft: 7, }}>
                        <SvgComponent svgKey="LogoSVG" width={moderateScale(100)} height={moderateScale(100)} fill={theme === 'dark' ? '#ffffff' : '#000'} />
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <NavigationContainer theme={theme === 'dark' ? DarkThemeNavigator : LightThemeNavigator}>
            <ThemeProvider>
                {currentUser ?
                    <UserProvider>
                        <MessagesNumProvider>
                            <AuthAppNavigator />
                        </MessagesNumProvider>
                    </UserProvider>
                    : <UnAuthAppNavigator />}
            </ThemeProvider>
        </NavigationContainer>
    );
}

export default AuthNavigation