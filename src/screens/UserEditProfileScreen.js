import { SafeAreaView } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import EditProfileHeader from '../components/UserEditProfile/EditProfileHeader';
import EditProfileForm from '../components/UserEditProfile/EditProfileForm';
import EditProfileImage from '../components/UserEditProfile/EditProfileImage';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

const UserEditProfileScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData } = route.params;
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    const headerEditProfile = t("screens.profile.text.profileEdit.editProfile");
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ backgroundColor: theme.Primary, flex: 1, justifyContent: "flex-start" }}>
            <EditProfileHeader navigation={navigation} headerTitle={headerEditProfile} theme={theme} />
            <Divider width={0.4} orientation='horizontal' color={theme.dividerPrimary} />
            <EditProfileImage userData={userData} theme={theme} t={t} />
            <Divider width={0.4} orientation='horizontal' color={theme.dividerPrimary} />
            <EditProfileForm userData={userData} navigation={navigation} theme={theme} t={t} />
            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
        </SafeAreaView>
    )
}



export default UserEditProfileScreen