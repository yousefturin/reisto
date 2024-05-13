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
import { getColorForTheme } from '../utils/ThemeUtils';

const { moderateScale } = initializeScalingUtils(Dimensions);

const AboutThisUserScreen = ({ route }) => {
    const { ownerID } = route.params;
    const { selectedTheme } = useTheme();
    const systemTheme = selectedTheme === "system";
    const theme = getColorForTheme(
        { dark: colorPalette.dark, light: colorPalette.light },
        selectedTheme,
        systemTheme
    );
    // const targetTime = new Date((timestampObj.seconds * 1000) + (timestampObj.nanoseconds / 1000000));
    const [userData, setUserData] = useState([])
    useEffect(() => {
        let unsubscribe
        const fetchUserData = () => {
            unsubscribe = db.collection('users').where('owner_uid', '==', ownerID).limit(1).onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => doc.data())[0];
                setUserData({
                    username: data.username,
                    profile_picture: data.profile_picture,
                    //short cut to get the date correctly formatted before assigning 
                    createdAt: formatCreatedAt(new Date((data.createdAt.seconds * 1000) + (data.createdAt.nanoseconds / 1000000)))
                });
            });
        }
        fetchUserData();
        return () => {
            // Unsubscribe when component unmounts
            unsubscribe && unsubscribe();
        };
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themePrimary }}>
            <SavedPostsHeader header={"About this account"} theme={theme} />
            <Divider width={0.7} orientation='horizontal' color={theme.dividerPrimary} />
            <AboutThisUserContent userData={userData} theme={theme} />
        </SafeAreaView>
    )
}

const AboutThisUserContent = ({ userData, theme }) => (
    <>
        <View style={{ justifyContent: "flex-start", alignItems: "center", marginHorizontal: 20, margin: 10 }}>
            <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                style={{
                    width: 90,
                    height: 90,
                    borderRadius: 50,
                    margin: 10,
                    borderWidth: 1.5,
                    borderColor: themeSecondary
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
            <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center", fontWeight: "500" }}>To help keep our community authentic, we're showing information about accounts on Reisto.</Text>
        </View>
        <View style={{ marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", gap: 10, marginVertical: 30, }}>
                <SvgComponent svgKey="CalenderSVG" width={moderateScale(30)} height={moderateScale(30)} />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "500" }}>Date joined</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "400" }}>{userData.createdAt}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <SvgComponent svgKey="LocationSVG" width={moderateScale(30)} height={moderateScale(30)} />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "500" }}>Account based in</Text>
                    {/* temp till the db and back-end fix the issue for getting location */}
                    <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "400" }}>{userData.location ? "undefined" : "Türkiye"}</Text>
                </View>
            </View>
        </View>
    </>
)

export default AboutThisUserScreen