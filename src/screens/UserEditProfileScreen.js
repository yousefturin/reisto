/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




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