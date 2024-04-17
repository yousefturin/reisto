import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import SearchScreen from "../screens/SearchScreen";
import AddPostScreen from "../screens/AddPostScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NavigationStack from "../components/Home/Navigation";
import { useNavigationState } from '@react-navigation/native';
import { UserContext } from "../context/UserDataProvider";
import OwnerProfilePostScreen from "../screens/OwnerProfilePostScreen";
import UserSettingScreen from "../screens/UserSettingScreen";
import UserActivityScreen from "../screens/UserActivityScreen";
import UserSavedPostScreen from "../screens/UserSavedPostScreen";
import UserSavedPostTimeLineScreen from "../screens/UserSavedPostTimeLineScreen";
import UserEditProfileScreen from "../screens/UserEditProfileScreen";
import UserEditProfileIndividualDataScreen from "../screens/UserEditProfileIndividualDataScreen";
import ShareExplorePostTimeLineScreen from "../screens/ShareExplorePostTimeLineScreen";
import OtherUsersProfileScreen from "../screens/OtherUsersProfileScreen";
import OthersProfilePostScreen from "../screens/OthersProfilePostScreen";

const Stack = createStackNavigator();



const customCardStyleInterpolator = ({ current, next, layouts }) => {
    return {
        cardStyle: {
            transform: [
                {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                },
                {
                    translateX: next
                        ? next.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -layouts.screen.width],
                        })
                        : 0,
                },
            ],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
            }),
        },
    };
};
const headerTintColor = "white";
const backgroundBarColor = "#050505";

const headerStyle = {
    height: 100,
    backgroundColor: backgroundBarColor,
    elevation: 0,
    shadowOpacity: 0,
};

const AuthAppNavigator = () => {
    // Function to determine if NavigationStack should be shown
    const navigationState = useNavigationState(state => state);
    const [currentRouteName, setCurrentRouteName] = useState('Home'); // Default to 'Home'

    useEffect(() => {
        if (navigationState && navigationState.routes && navigationState.index !== undefined) {
            const routeName = navigationState.routes[navigationState.index]?.name;
            setCurrentRouteName(routeName);
        }
    }, [navigationState]);
    const userData = useContext(UserContext);
    const shouldShowNavigationStack = currentRouteName !== 'AddPost'
        && currentRouteName !== 'UserEditProfile'
        && currentRouteName !== 'UserEditProfileIndividualData';
    return (
        <>
            <Stack.Navigator
                initialRouteName={"Home"}
                screenOptions={{
                    headerTintColor,
                    headerTitle: null,
                    headerStyle: headerStyle,
                    cardStyleInterpolator: customCardStyleInterpolator, // Custom animation
                }}
            >
                <Stack.Screen
                    name={"Home"}
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"Search"}
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"AddPost"}
                    component={AddPostScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"Notification"}
                    component={NotificationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"Profile"}
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"OwnerProfilePost"}
                    component={OwnerProfilePostScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserSetting"}
                    component={UserSettingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserActivity"}
                    component={UserActivityScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserSavedPost"}
                    component={UserSavedPostScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserSavedPostTimeLine"}
                    component={UserSavedPostTimeLineScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserEditProfile"}
                    component={UserEditProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserEditProfileIndividualData"}
                    component={UserEditProfileIndividualDataScreen}
                    options={{
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name={"ShareExplorePostTimeLine"}
                    component={ShareExplorePostTimeLineScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"OtherUsersProfileScreen"}
                    component={OtherUsersProfileScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"OthersProfilePost"}
                    component={OthersProfilePostScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
            {shouldShowNavigationStack && <NavigationStack routeName={currentRouteName} userData={userData} />}
        </>
    )
}

const UnAuthAppNavigator = () => (
    <Stack.Navigator
        initialRouteName={"Login"}
        screenOptions={{
            headerTintColor,
            headerTitle: null,
            headerStyle: headerStyle,
            cardStyleInterpolator: customCardStyleInterpolator, // Custom animation
        }}
    >
        <Stack.Screen
            name={"Login"}
            component={LoginScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name={"Signup"}
            component={SignupScreen}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
)






export { AuthAppNavigator, UnAuthAppNavigator };
