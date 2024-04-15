import { SafeAreaView } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import EditProfileForm from '../components/UserEditProfile/EditProfileForm';
import EditProfileImage from '../components/UserEditProfile/EditProfileImage';

const UserEditProfileScreen = ({ route }) => {
    const { userData } = route.params;
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ backgroundColor: "#050505", flex: 1, justifyContent: "flex-start" }}>
            <EditProfileHeader navigation={navigation} headerTitle={"Edit profile"} />
            <Divider width={0.4} orientation='horizontal' color="#2b2b2b" />
            <EditProfileImage userData={userData} />
            <Divider width={0.4} orientation='horizontal' color="#2b2b2b" />
            <EditProfileForm userData={userData} navigation={navigation} />
            <Divider width={0.5} orientation='horizontal' color="#2b2b2b" />
        </SafeAreaView>
    )
}



export default UserEditProfileScreen