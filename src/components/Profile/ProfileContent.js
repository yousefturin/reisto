import { View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { extractDomain } from '../../utils/ExtractDomainFromLink';
import { WebView } from 'react-native-webview';
import { Divider } from 'react-native-elements';
import { db, firebase } from '../../firebase';



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

    useEffect(() => {
        getFollowersAndFollowingData();
    }, [])

    const getFollowersAndFollowingData = async () => {
        const querySnapshot = await db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('following_followers')
            .limit(1) // Limit query to one document
            .get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const docRef = doc.ref;

            docRef.onSnapshot((snapshot) => {
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
            // No documents found
            console.log("No document found in the collection.");
        }
    };
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
                            borderColor: "#2b2b2b"
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        cachePolicy={"memory-disk"}
                        transition={50} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1, }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(userPosts).length}
                        </Text>
                        <Text style={{ color: "#cccccc" }}>
                            recipes
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.followers).length}
                        </Text>
                        <Text style={{ color: "#cccccc" }}>
                            followers
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowing?.following).length}
                        </Text>
                        <Text style={{ color: "#cccccc" }}>
                            following
                        </Text>
                    </View>
                </View>
            </View>
            {/* Will be connected to DB soon */}
            {userData.displayed_name &&
                <View style={{ marginHorizontal: 20, maxHeight: 50, }} >
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                        {userData.displayed_name}
                    </Text>
                </View>
            }
            {userData.bio &&
                <View style={{ marginHorizontal: 20, maxHeight: 50 }} >
                    <Text style={{ color: "#fff" }}>
                        {userData.bio}
                    </Text>
                </View>
            }
            {userData.link &&
                <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 20, marginTop: 5, maxHeight: 50, flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end" }}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={{ color: "#d8e0fa" }}>
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
                    style={{ backgroundColor: "#262626", flex: 1 }}
                >
                    <View style={{
                        height: 5,
                        width: 40,
                        backgroundColor: "#1C1C1E",
                        borderRadius: 10,
                        marginTop: 10,
                        shadowColor: "black",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        backgroundColor: "#383838",
                        alignSelf: "center"
                    }} />
                    <View style={{ marginTop: 10 }}></View>
                    <Divider width={1} orientation='horizontal' color="#383838" />
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
                        backgroundColor: "#1C1C1E",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: "#1C1C1E",
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: "#ffffff",
                            textAlign: "center"
                        }}>Edit profile</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: "#1C1C1E",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: "#1C1C1E",
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: "#ffffff",
                            textAlign: "center"
                        }}>Share profile</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ProfileContent