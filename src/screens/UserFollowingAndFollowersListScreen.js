import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';



const UserFollowingAndFollowersListScreen = ({ route }) => {
    const { userData, data, flag } = route.params;
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <EditProfileHeader headerTitle={userData.username} navigation={navigation} />
        </SafeAreaView>
    );
};

export default UserFollowingAndFollowersListScreen;