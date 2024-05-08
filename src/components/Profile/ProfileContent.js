import { View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { extractDomain } from '../../utils/ExtractDomainFromLink';
import { WebView } from 'react-native-webview';
import { Divider } from 'react-native-elements';
import { db, firebase } from '../../firebase';
import { colorPalette } from '../../Config/Theme';




const ProfileContent = ({ userData, userPosts }) => {
    const navigation = useNavigation();
    const handleEditProfileNavigation = () => {
        navigation.navigate("UserEditProfile", {
            userData
        })
    }
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [followersAndFollowing, setFollowersAndFollowing] = useState({ followers: '', following: '', id: '' })
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    // this took my 4 hours to remove the error of unsubscribe is not a function and i am still not sure if this is the correct way to do it
    useEffect(() => {
        let unsubscribe;
        const fetchData = async () => {
            const querySnapshot = await db.collection('users')
                .doc(firebase.auth().currentUser.email)
                .collection('following_followers')
                .limit(1)
                .get();
    
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;
                // Define snapshot listener function
                unsubscribe = docRef.onSnapshot((snapshot) => {
                    const data = snapshot.data();
                    setFollowersAndFollowing({
                        id: snapshot.id,
                        followers: data.followers,
                        following: data.following,
                    });
                }, (error) => {
                    console.error("Error listening to document:", error);
                });
            } else {
                console.log("No document found in the collection.");
            }
        };
    
        fetchData();
    
        return () => {
            // Unsubscribe when component unmounts
            unsubscribe && unsubscribe();
        };
    }, []);

    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(userData.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                // Initialize an array to store batched fetch promises
                const fetchPromises = [];
                const fetchPromisesSecond = [];

                // Push fetch promises for each follower-<<<<<<<< need to fix the issue where i have no idea what to show for users is it followers or following or both
                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromises.push(fetchPromise);
                }
                for (const followers of data.followers) {
                    const fetchPromise = db.collection('users').doc(followers).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                // Execute batched reads
                const [followingDocs, followerDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                // Extract data from follower documents
                const followersData = followerDocs
                    .filter(doc => doc.exists)
                    .map(doc => doc.data());
                const followingData = followingDocs
                    .filter(doc => doc.exists)
                    .map(doc => doc.data());

                setFollowersData(followersData);
                setFollowingData(followingData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    const handleUserFollowingAndFollowerDisplay = (flag) => {
        let data
        if (flag === "followers") {
            data = followersData
        }
        if (flag === "following") {
            data = followingData
        }
        navigation.navigate("UserFollowingAndFollowersList", {
            userData: userData,
            data: data,
            paramFollowing: followingData,
            paramFollower: followersData,
            flag: flag
        })
    }

    return (
        <View style={{ flexDirection: "column", }}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ width: "30%", justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            margin: 10,
                            borderWidth: 1.5,
                            borderColor: colorPalette.dark.Secondary
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                        transition={50} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1, }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(userPosts).length}
                        </Text>
                        <Text style={{ color: colorPalette.dark.textQuaternary }}>
                            recipes
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => handleUserFollowingAndFollowerDisplay("followers")} style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.followers).length}
                        </Text>
                        <Text style={{ color: colorPalette.dark.textQuaternary }}>
                            followers
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleUserFollowingAndFollowerDisplay("following")} style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: colorPalette.dark.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.following).length}
                        </Text>
                        <Text style={{ color: colorPalette.dark.textQuaternary}}>
                            following
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Will be connected to DB soon */}
            {userData.displayed_name &&
                <View style={{ marginHorizontal: 20, maxHeight: 50, }} >
                    <Text style={{ color: colorPalette.dark.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        {userData.displayed_name}
                    </Text>
                </View>
            }
            {userData.bio &&
                <View style={{ marginHorizontal: 20, maxHeight: 50 }} >
                    <Text style={{ color: colorPalette.dark.textPrimary }}>
                        {userData.bio}
                    </Text>
                </View>
            }
            {userData.link &&
                <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 20, marginTop: 5, maxHeight: 50, flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end" }}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={{ color: colorPalette.dark.textURL }}>
                        {extractDomain(userData.link)}
                    </Text>
                    <SvgComponent svgKey="LinkSVG" width={moderateScale(18)} height={moderateScale(18)} />
                </TouchableOpacity>
            }
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={false}
                presentationStyle="pageSheet"
                statusBarTranslucent={false}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View
                    style={{ backgroundColor: colorPalette.dark.SubPrimary, flex: 1 }}
                >
                    <View style={{
                        height: 5,
                        width: 40,
                        backgroundColor: colorPalette.dark.Quinary,
                        borderRadius: 10,
                        marginTop: 10,
                        shadowColor: "black",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        backgroundColor: colorPalette.dark.Tertiary,
                        alignSelf: "center"
                    }} />
                    <View style={{ marginTop: 10 }}></View>
                    <Divider width={1} orientation='horizontal' color={colorPalette.dark.dividerPrimary} />
                    <WebView source={{ uri: userData.link }} />
                </View>
            </Modal>

            <View style={{
                justifyContent: "space-around",
                flexDirection: "row",
                marginHorizontal: 20,
                gap: 10,
            }} >
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleEditProfileNavigation()}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: colorPalette.dark.Quinary,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: colorPalette.dark.Quinary,
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: colorPalette.dark.textPrimary,
                            textAlign: "center"
                        }}>Edit profile</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: colorPalette.dark.Quinary,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: colorPalette.dark.Quinary,
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: colorPalette.dark.textPrimary,
                            textAlign: "center"
                        }}>Share profile</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ProfileContent