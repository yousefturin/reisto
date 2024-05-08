import { SafeAreaView } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import EditProfileForm from '../components/UserEditProfile/EditProfileForm';
import EditProfileImage from '../components/UserEditProfile/EditProfileImage';
import { colorPalette } from '../Config/Theme';

const UserEditProfileScreen = ({ route }) => {
    const { userData } = route.params;
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ backgroundColor: colorPalette.dark.Primary , flex: 1, justifyContent: "flex-start" }}>
            <EditProfileHeader navigation={navigation} headerTitle={"Edit profile"} />
            <Divider width={0.4} orientation='horizontal' color={colorPalette.dark.dividerPrimary}  />
            <EditProfileImage userData={userData} />
            <Divider width={0.4} orientation='horizontal' color={colorPalette.dark.dividerPrimary}  />
            <EditProfileForm userData={userData} navigation={navigation} />
            <Divider width={0.5} orientation='horizontal' color={colorPalette.dark.dividerPrimary}  />
        </SafeAreaView>
    )
}



export default UserEditProfileScreen