/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';
import { Divider } from 'react-native-elements';
import { db } from '../../firebase';


const MessagesIndividualHeader = ({ header, theme }) => {
    const navigation = useNavigation();
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const handlePressBack = () => {
        navigation.goBack()
    }

    const handleNavigation = () => {
        const unsubscribe = db.collection('users').where('owner_uid', '==', header.owner_uid).limit(1).onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => doc.data())[0];
            let userDataUid = ({
                username: data.username,
                profile_picture: data.profile_picture,
                displayed_name: data.displayed_name,
                bio: data.bio,
                link: data.link,
                owner_uid: data.owner_uid,
                id: data.email
            });
            navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated: userDataUid ,justSeenPost: null})
        }, error => {
            console.error("Error listening to document:", error);
            return () => { };
        });
        return () => unsubscribe()
    }

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10, }}>
                <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flex: 1, gap: 10, }}>
                    <TouchableOpacity onPress={() => handleNavigation()}>
                        <Image
                            source={{ uri: header.profile_picture, cache: "force-cache" }}
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 50,
                                borderWidth: 1,
                                borderColor: theme.Secondary
                            }}
                            placeholder={blurHash}
                            contentFit="cover"
                            cachePolicy={"memory-disk"}
                            transition={50}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation()}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{header.username}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ margin: 10, width: moderateScale(30) }}>
                </View>
            </View>
            <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
        </>
    )
}

export default MessagesIndividualHeader