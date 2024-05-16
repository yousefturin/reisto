import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { UserContext } from '../../context/UserDataProvider';

const EditProfileForm = ({ navigation, theme, t }) => {
    const [isNamePressed, setIsNamePressed] = useState(false);
    const [isBioPressed, setIsBioPressed] = useState(false);
    const [isLinkPressed, setIsLinkPressed] = useState(false);
    // the EditProfileForm is already has userData but to obtain the must new data i need to call the provider to get that from here 
    const userData = useContext(UserContext);

    const handlePressIn = (id) => {
        switch (id) {
            case 'Name':
                setIsNamePressed(true);
                break;
            case 'Bio':
                setIsBioPressed(true);
                break;
            case 'Link':
                setIsLinkPressed(true);
                break;
            default:
                break;
        }
    };

    const handlePressOut = (id) => {
        switch (id) {
            case 'Name':
                setIsNamePressed(false);
                break;
            case 'Bio':
                setIsBioPressed(false);
                break;
            case 'Link':
                setIsLinkPressed(false);
                break;
            default:
                break;
        }
    };
    const handleNavigationPress = (id) => {
        let key;
        let value;
        let headerTitleForScreen;
        switch (id) {
            case 'Name':
                key = 'Name';
                headerTitleForScreen = t('screens.profile.text.profileEdit.name');
                value = userData.displayed_name ? userData.displayed_name : '';
                break;
            case 'Bio':
                key = 'Bio';
                headerTitleForScreen = t('screens.profile.text.profileEdit.bio');
                value = userData.bio ? userData.bio : '';
                break;
            case 'Link':
                key = 'Link';
                headerTitleForScreen = t('screens.profile.text.profileEdit.link');
                value = userData.link ? userData.link : '';
                break;
            default:
                break;
        }
        navigation.navigate("UserEditProfileIndividualData", { userData, key, value, headerTitleForScreen });
    }
    return (
        <View style={{}}>
            <View style={{ flexDirection: "column", backgroundColor: isNamePressed ? theme.Secondary : theme.Primary }}>
                <TouchableOpacity style={{ flexDirection: "row", }}
                    onPressIn={() => handlePressIn('Name')}
                    onPressOut={() => handlePressOut('Name')}
                    onPress={() => handleNavigationPress('Name')}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, marginVertical: 15, width: "25%", marginLeft: 20 }}>{t('screens.profile.text.profileEdit.name')}</Text>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: isNamePressed ? theme.btnPrimary : userData.displayed_name ? theme.textSubPrimary : theme.Primary === "#050505" ? theme.Secondary : theme.dividerPrimary, marginVertical: 15, width: "75%" }}>{userData.displayed_name ? userData.displayed_name : t('screens.profile.text.profileEdit.name')}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <View style={{ flexDirection: "column", }}>
                <TouchableOpacity style={{ flexDirection: "row" }}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, marginVertical: 15, width: "25%", marginLeft: 20 }}>{t('screens.profile.text.profileEdit.username')}</Text>
                    <Text style={{ fontSize: 18, color: theme.textPrimary, marginVertical: 15, width: "75%" }}>{userData.username}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: isBioPressed ? theme.Secondary : theme.Primary }}
                    onPressIn={() => handlePressIn('Bio')}
                    onPressOut={() => handlePressOut('Bio')}
                    onPress={() => handleNavigationPress('Bio')}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, marginVertical: 15, width: "25%", marginLeft: 20 }}>{t('screens.profile.text.profileEdit.bio')}</Text>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: isBioPressed ? theme.btnPrimary : userData.bio ? theme.textSubPrimary : theme.Primary === "#050505" ? theme.Secondary : theme.dividerPrimary, marginVertical: 15, width: "75%" }}>{userData.bio ? userData.bio : t('screens.profile.text.profileEdit.bio')}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <TouchableOpacity style={{ flexDirection: "row", backgroundColor: isLinkPressed ? theme.Secondary : theme.Primary }}
                onPressIn={() => handlePressIn('Link')}
                onPressOut={() => handlePressOut('Link')}
                onPress={() => handleNavigationPress('Link')}
                activeOpacity={1}>
                <Text style={{ fontSize: 18, fontWeight: "400", color: theme.textSubPrimary, marginVertical: 15, width: "25%", marginLeft: 20 }}>{t('screens.profile.text.profileEdit.link')}</Text>
                <Text style={{ fontSize: 18, fontWeight: "400", color: isLinkPressed ? theme.btnPrimary : userData.link ? theme.textSubPrimary : theme.Primary === "#050505" ? theme.Secondary : theme.dividerPrimary, marginVertical: 15, width: "75%" }}>{userData.link ? userData.link : t('screens.profile.text.profileEdit.link')}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditProfileForm