import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';

const NavigationStack = ({ routeName, userData }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    // profile image flickering issue is related to useEffect since each time the navigation is applied
    // the useEffect will run once and that will make a problem the image must be taken and then it will be stored inside the async storage.
    // The data will be stored in async storage and will be changed every time a user is changing the profile Image, or the user is
    // signing out or logging in the the application to always fetch the newer Image.
    // const [userData, setUserData] = useState([])

    // Check if userData is available before rendering
    if (!userData || !userData.profile_picture) {
        return null; // Or any loading indicator
    }
    const navigation = useNavigation();
    
    // still needs fixing this issue where there are 
    // common screens that are used in the navigation stack and based on that 
    // the icon show change to active or inactive.
    const icons = [
        {
            action: 'Home',
            inhered: [
                'Home',
                'OtherUsersProfileScreen',
                'OthersProfilePost',],
            activeURL: 'HomeSVG',
            inActiveURL: 'HomeSVGInActive',
        },
        {
            action: 'Search',
            inhered: [
                'Search',
                'SearchExplorePostTimeLine',],
            activeURL: 'SearchSVG',
            inActiveURL: 'SearchSVGInActive',
        },
        {
            action: 'AddPost',
            inhered: ['AddPost'],
            activeURL: 'AddPostSVG',
            inActiveURL: 'AddPostSVGInActive',
        },
        {
            action: 'Notification',
            inhered: ['Notification'],
            activeURL: 'NotificationSVG',
            inActiveURL: 'NotificationSVGInActive',
        },
        {
            action: [
                'UserProfile',
                'UserFollowingAndFollowersList',
                'UserSavedPostTimeLine',
                'UserSavedPost',
                'UserActivity',
                'UserSetting',
                'UserProfilePost'],
            activeURL: `${userData.profile_picture}`,
        },
    ]
    //#region Post Footer
    const NavigationButtons = ({ routeName }) => {
        return (
            <>
                <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                <View style={{ flexDirection: "row", justifyContent: "space-around", height: 80, paddingTop: 5, }}>
                    {icons.slice(0, 4).map((icon, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                // this is the navigation to the screen needs to be fixed so 
                                // that the navigation will be done to the screen that is needed 
                                //since the actions for the icons will be changes to include more screens sub-from home screen.
                                navigation.navigate(icon.action);
                            }}
                            style={{ padding: 10 }}
                        >
                            <SvgComponent
                                svgKey={icon.inhered.includes(routeName) ? icon.activeURL : icon.inActiveURL}
                                width={moderateScale(25)}
                                height={moderateScale(25)}
                            />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("UserProfile");

                    }} style={{ padding: 10 }}>
                        {/* ProfileBtn */}
                        <Image
                            source={{ uri: icons[4].activeURL, cache: "force-cache" }}
                            style={{
                                width: moderateScale(25),
                                height: moderateScale(25),
                                borderRadius: 50,
                                borderWidth: icons[4].action.includes(routeName) ? 1.5 : 1,
                                borderColor: icons[4].action.includes(routeName) ? "#ffff" : "#2b2b2b"
                            }}
                            placeholder={blurHash}
                            cachePolicy={"memory-disk"}
                            transition={50}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }
    //#endregion

    return (
        <View style={{ backgroundColor: "#050505" }}>
            <NavigationButtons routeName={routeName} />
        </View>
    )
}

export default NavigationStack