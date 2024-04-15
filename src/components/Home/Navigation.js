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
    const icons = [
        {
            action: 'Home',
            activeURL: 'HomeSVG',
            inActiveURL: 'HomeSVGInActive',
        },
        {
            action: 'Search',
            activeURL: 'SearchSVG',
            inActiveURL: 'SearchSVGInActive',
        },
        {
            action: 'AddPost',
            activeURL: 'AddPostSVG',
            inActiveURL: 'AddPostSVGInActive',
        },
        {
            action: 'Notification',
            activeURL: 'NotificationSVG',
            inActiveURL: 'NotificationSVGInActive',
        },
        {
            action: 'Profile',
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
                                navigation.navigate(icon.action);
                            }}
                            style={{ padding: 10 }}
                        >
                            <SvgComponent
                                svgKey={icon.action === routeName ? icon.activeURL : icon.inActiveURL}
                                width={moderateScale(25)}
                                height={moderateScale(25)}
                            />
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Profile");

                    }} style={{ padding: 10 }}>
                        {/* ProfileBtn */}
                        <Image source={{ uri: icons[4].activeURL, cache: "force-cache" }}
                            style={{
                                width: moderateScale(25),
                                height: moderateScale(25),
                                borderRadius: 50,
                                borderWidth: 1,
                                borderColor: "#2b2b2b"
                                
                            }} placeholder={blurHash}
                            cachePolicy={"memory-disk"}

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