import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import SearchScreen from "../screens/SearchScreen";
import AddPostScreen from "../screens/AddPostScreen";
import NotificationScreen from "../screens/NotificationScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import NavigationStack from "../components/Home/Navigation";
import { useNavigationState } from '@react-navigation/native';
import { UserContext } from "../context/UserDataProvider";
import UserProfilePostScreen from "../screens/UserProfilePostScreen";
import UserSettingScreen from "../screens/UserSettingScreen";
import UserActivityScreen from "../screens/UserActivityScreen";
import UserSavedPostScreen from "../screens/UserSavedPostScreen";
import UserSavedPostTimeLineScreen from "../screens/UserSavedPostTimeLineScreen";
import UserEditProfileScreen from "../screens/UserEditProfileScreen";
import UserEditProfileIndividualDataScreen from "../screens/UserEditProfileIndividualDataScreen";
import SearchExplorePostTimeLineScreen from "../screens/SearchExplorePostTimeLineScreen";
import OtherUsersProfileScreen from "../screens/OtherUsersProfileScreen";
import OthersProfilePostScreen from "../screens/OthersProfilePostScreen";
import MessagingMainScreen from "../screens/MessagingMainScreen";
import AboutThisUserScreen from "../screens/AboutThisUserScreen";
import MessagingIndividualScreen from "../screens/MessagingIndividualScreen";
import UserFollowingAndFollowersListScreen from "../screens/UserFollowingAndFollowersListScreen";
import MessagingNewForFollowersAndFollowingScreen from "../screens/MessagingNewForFollowersAndFollowingScreen";
import FromMessagesToSharedPost from "../screens/FromMessagesToSharedPost";
import { colorPalette } from "../Config/Theme";
import AdditionalSearchScreen from "../screens/AdditionalSearchScreen";

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
const customCardStyleInterpolator2 = ({ current, next, layouts }) => {
    return {
        cardStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
            }),
        },
    };
};
const getCardStyleInterpolator = (route) => {
    console.log(route.name);
    switch (route.name) {
        case 'AdditionalSearchScreen':
            return customCardStyleInterpolator2;
        case 'Home':
            return customCardStyleInterpolator;
        default:
            return customCardStyleInterpolator;
    }
};
const headerTintColor = "white";
const backgroundBarColor = colorPalette.dark.Primary;

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
    const userData = useContext(UserContext);

    useEffect(() => {
        if (navigationState && navigationState.routes && navigationState.index !== undefined) {
            const routeName = navigationState.routes[navigationState.index]?.name;
            setCurrentRouteName(routeName);
        }
    }, [navigationState]);

    const shouldShowNavigationStack = currentRouteName !== 'AddPost'
        && currentRouteName !== 'UserEditProfile'
        && currentRouteName !== 'UserEditProfileIndividualData'
        && currentRouteName !== 'MessagingMain'
        && currentRouteName !== 'AboutThisUser'
        && currentRouteName !== 'MessageIndividual'
        && currentRouteName !== 'MessagingNewMessageForFollowerAndFollowings'
        && currentRouteName !== 'FromMessagesToSharedPost';

    return (
        <>
            <Stack.Navigator
                initialRouteName={"Home"}
                screenOptions={({ route }) => ({
                    headerTintColor,
                    headerTitle: null,
                    headerStyle: headerStyle,
                    cardStyleInterpolator: getCardStyleInterpolator(route),
                })}
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
                    name={"UserProfile"}
                    component={UserProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={"UserProfilePost"}
                    component={UserProfilePostScreen}
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
                    name={"SearchExplorePostTimeLine"}
                    component={SearchExplorePostTimeLineScreen}
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
                <Stack.Screen
                    name={"MessagingMain"}
                    component={MessagingMainScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"AboutThisUser"}
                    component={AboutThisUserScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"MessageIndividual"}
                    component={MessagingIndividualScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"UserFollowingAndFollowersList"}
                    component={UserFollowingAndFollowersListScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"MessagingNewMessageForFollowerAndFollowings"}
                    component={MessagingNewForFollowersAndFollowingScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"FromMessagesToSharedPost"}
                    component={FromMessagesToSharedPost}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name={"AdditionalSearchScreen"}
                    component={AdditionalSearchScreen}
                    options={({ route }) => ({
                        // cardStyleInterpolator: getCardStyleInterpolator(route), // Custom animation
                        headerShown: false,
                        // transitionSpec: {
                        //     open: config,
                        //     close: config,
                        // },
                    })}
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
