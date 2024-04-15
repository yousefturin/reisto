import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { UserContext } from '../../context/UserDataProvider';

const EditProfileForm = ({ navigation }) => {
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
        switch (id) {
            case 'Name':
                key = 'Name';
                value = userData.displayed_name ? userData.displayed_name : '';
                break;
            case 'Bio':
                key = 'Bio';
                value = userData.bio ? userData.bio : '';
                break;
            case 'Link':
                key = 'Link';
                value = userData.link ? userData.link : '';
                break;
            default:
                break;
        }
        navigation.navigate("UserEditProfileIndividualData", { userData, key, value });
    }
    return (
        <View style={{}}>
            <View style={{ flexDirection: "column", backgroundColor: isNamePressed ? '#2b2b2b' : '#050505' }}>
                <TouchableOpacity style={{ flexDirection: "row", }}
                    onPressIn={() => handlePressIn('Name')}
                    onPressOut={() => handlePressOut('Name')}
                    onPress={() => handleNavigationPress('Name')}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#f2f2f2", marginVertical: 15, width: "25%", marginLeft: 20 }}>Name</Text>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: isNamePressed ? "#515151" : userData.displayed_name ? "#f2f2f2" : "#2b2b2b", marginVertical: 15, width: "75%" }}>{userData.displayed_name ? userData.displayed_name : "Name"}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color="#2b2b2b" style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <View style={{ flexDirection: "column", }}>
                <TouchableOpacity style={{ flexDirection: "row" }}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#f2f2f2", marginVertical: 15, width: "25%", marginLeft: 20 }}>Username</Text>
                    <Text style={{ fontSize: 18, color: "#fff", marginVertical: 15, width: "75%" }}>{userData.username}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color="#2b2b2b" style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <View style={{ flexDirection: "column" }}>
                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: isBioPressed ? '#2b2b2b' : '#050505' }}
                    onPressIn={() => handlePressIn('Bio')}
                    onPressOut={() => handlePressOut('Bio')}
                    onPress={() => handleNavigationPress('Bio')}
                    activeOpacity={1}>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: "#f2f2f2", marginVertical: 15, width: "25%", marginLeft: 20 }}>Bio</Text>
                    <Text style={{ fontSize: 18, fontWeight: "400", color: isBioPressed ? "#515151" : userData.bio ? "#f2f2f2" : "#2b2b2b", marginVertical: 15, width: "75%" }}>{userData.bio ? userData.bio : "Bio"}</Text>
                </TouchableOpacity>
                <Divider width={0.5} orientation='horizontal' color="#2b2b2b" style={{ width: "65%", alignSelf: "flex-end", marginHorizontal: 20 }} />
            </View>
            <TouchableOpacity style={{ flexDirection: "row", backgroundColor: isLinkPressed ? '#2b2b2b' : '#050505' }}
                onPressIn={() => handlePressIn('Link')}
                onPressOut={() => handlePressOut('Link')}
                onPress={() => handleNavigationPress('Link')}
                activeOpacity={1}>
                <Text style={{ fontSize: 18, fontWeight: "400", color: "#f2f2f2", marginVertical: 15, width: "25%", marginLeft: 20 }}>Link</Text>
                <Text style={{ fontSize: 18, fontWeight: "400", color: isLinkPressed ? "#515151" : userData.link ? "#f2f2f2" : "#2b2b2b", marginVertical: 15, width: "75%" }}>{userData.link ? userData.link : "Link"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditProfileForm