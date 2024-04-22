import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';



const UserFollowingAndFollowersListScreen = ({ route }) => {
    const { userData, data, flag } = route.params;
    console.log(data)
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <EditProfileHeader headerTitle={userData.username} navigation={navigation} />
            <View>
                {data.map((item, index) => (
                    <View key={index}>
                        <Image style={{ width: 50, height: 50 ,borderRadius:50}} source={item.profile_picture} />
                        <Text style={{color:"#fff"}}>{item.username}</Text>
                        <Text style={{color:"#fff"}}>{item.display_name}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default UserFollowingAndFollowersListScreen;