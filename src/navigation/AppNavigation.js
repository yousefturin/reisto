import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import SearchScreen from "../screens/SearchScreen";
import AddPostScreen from "../screens/AddPostScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";

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

const AuthAppNavigator = () => (
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
        </Stack.Navigator>
)
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
