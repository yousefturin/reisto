import { SafeAreaView } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import EditProfileForm from '../components/UserEditProfile/EditProfileForm';
import EditProfileImage from '../components/UserEditProfile/EditProfileImage';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';
import { getColorForTheme } from '../utils/ThemeUtils';

const UserEditProfileScreen = ({ route }) => {
    const { userData } = route.params;
    const { selectedTheme } = useTheme();
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPalette.dark, light: colorPalette.light },
        selectedTheme,
        systemTheme
    );

    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ backgroundColor: theme.Primary , flex: 1, justifyContent: "flex-start" }}>
            <EditProfileHeader navigation={navigation} headerTitle={"Edit profile"} theme={theme} />
            <Divider width={0.4} orientation='horizontal' color={theme.dividerPrimary}  />
            <EditProfileImage userData={userData}  theme={theme}  />
            <Divider width={0.4} orientation='horizontal' color={theme.dividerPrimary}  />
            <EditProfileForm userData={userData} navigation={navigation}  theme={theme}  />
            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary}  />
        </SafeAreaView>
    )
}



export default UserEditProfileScreen