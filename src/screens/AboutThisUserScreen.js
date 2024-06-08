/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { View, SafeAreaView, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import { Divider } from 'react-native-elements';
import { Image } from 'expo-image';
import { db, firebase } from '../firebase'
import { blurHash } from '../../assets/HashBlurData';
import SvgComponent from '../utils/SvgComponents';
import initializeScalingUtils from '../utils/NormalizeSize';
import { formatCreatedAt } from '../utils/FormatCreateAt';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

const { moderateScale } = initializeScalingUtils(Dimensions);

const AboutThisUserScreen = ({ route }) => {
    const { t } = useTranslation();
    const { ownerID } = route.params;
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const [userData, setUserData] = useState([])
    const headerTitle = t("screens.home.text.aboutThisAccount.headerTitle")

    useEffect(() => {
        let unsubscribe
        const fetchUserData = () => {
            unsubscribe = db.collection('users').where('owner_uid', '==', ownerID).limit(1).onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => doc.data())[0];
                setUserData({
                    username: data.username,
                    profile_picture: data.profile_picture,
                    // Shortcut to get the date correctly formatted before assigning 
                    createdAt: formatCreatedAt(new Date((data.createdAt.seconds * 1000) + (data.createdAt.nanoseconds / 1000000)))
                });
            }, error => {
                return () => { };
            });
        }
        fetchUserData();
        return () => {
            // Unsubscribe when component unmounts
            unsubscribe && unsubscribe();
        };
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <SavedPostsHeader header={headerTitle} theme={theme} />
            <Divider width={0.7} orientation='horizontal' color={theme.dividerPrimary} />
            <AboutThisUserContent userData={userData} theme={theme} t={t} />
        </SafeAreaView>
    )
}

const AboutThisUserContent = ({ userData, theme, t }) => (
    <>
        <View style={{ justifyContent: "flex-start", alignItems: "center", marginHorizontal: 20, margin: 10 }}>
            <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                style={{
                    width: 90,
                    height: 90,
                    borderRadius: 50,
                    margin: 10,
                    borderWidth: 1.5,
                    borderColor: theme.Secondary
                }}
                placeholder={blurHash}
                contentFit="cover"
                transition={50}
                cachePolicy={"memory-disk"} />
            <View style={{ marginHorizontal: 20, maxHeight: 50, margin: 10 }} >
                <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>
                    {userData.username}
                </Text>
            </View>
            <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center", fontWeight: "500" }}>{t("screens.home.text.aboutThisAccount.explanation")}</Text>
        </View>
        <View style={{ marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", gap: 10, marginVertical: 30, }}>
                <SvgComponent svgKey="CalenderSVG" width={moderateScale(30)} height={moderateScale(30)} />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "500" }}>{t("screens.home.text.aboutThisAccount.dateInfo")}</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "400" }}>{userData.createdAt}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <SvgComponent svgKey="LocationSVG" width={moderateScale(30)} height={moderateScale(30)} />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "500" }}>{t("screens.home.text.aboutThisAccount.locationInfo")}</Text>
                    {/* temp till the db and back-end fix the issue for getting location */}
                    <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "400" }}>{userData.location ? "undefined" : "Türkiye"}</Text>
                </View>
            </View>
        </View>
    </>
)

export default AboutThisUserScreen