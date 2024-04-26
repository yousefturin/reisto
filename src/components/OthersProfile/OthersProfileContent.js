import { View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blurHash } from '../../../assets/HashBlurData';
import { Image } from 'expo-image';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { extractDomain } from '../../utils/ExtractDomainFromLink';
import { WebView } from 'react-native-webview';
import { Divider } from 'react-native-elements';
import { db, firebase } from '../../firebase';

const OthersProfileContent = ({ userDataToBeNavigated, userPosts }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [followersAndFollowing, setFollowersAndFollowing] = useState([])
    const [followersAndFollowingForPassedUser, setFollowersAndFollowingForPassedUser] = useState([])
    const [userDataAfterNavigation, setUserDataAfterNavigation] = useState(userDataToBeNavigated)
    const isUserFollowed = followersAndFollowing?.following?.includes(userDataToBeNavigated.id)
    // a stupid code was made before depending on the route to get all the data of the user, but now it will only be the id of the user and the rest will be fetched.
    useEffect(() => {
        const GetPostOwnerData = (userDataToBeNavigated) => {
            return new Promise((resolve, reject) => {
                const unsubscribe = db.collection('users').where('owner_uid', '==', userDataToBeNavigated.owner_uid).limit(1).onSnapshot(snapshot => {
                    const data = snapshot.docs.map(doc => doc.data())[0];
                    const userDataNew = {
                        username: data.username,
                        profile_picture: data.profile_picture,
                        displayed_name: data.displayed_name,
                        bio: data.bio,
                        link: data.link,
                        id: data.email,
                        owner_uid: userDataToBeNavigated.owner_uid
                    };
                    // this was the only way to do it otherwise the useStat wil not be updated when it pass the Params to navigation
                    setUserDataAfterNavigation(userDataNew);
                });
                return () => unsubscribe();
            });
        };

        // Call the function here
        GetPostOwnerData(userDataToBeNavigated);
    }, []);
    useEffect(() => {
        let unsubscribe;
        const getFollowersAndFollowingDataForCurrentUser = async () => {
            const querySnapshot = await db.collection('users')
                .doc(firebase.auth().currentUser.email)
                .collection('following_followers')
                .limit(1) // Limit query to one document
                .get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;

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
                // No documents found
                console.log("No document found in the collection.");
            }
        };
        getFollowersAndFollowingDataForCurrentUser();
        return () => {
            // Unsubscribe when component unmounts
            unsubscribe && unsubscribe();
        };
    }, []);


    useEffect(() => {
        let unsubscribe;
        const getFollowersAndFollowingDataForPassedUser = async () => {
            const querySnapshot = await db.collection('users')
                .doc(userDataAfterNavigation.id)
                .collection('following_followers')
                .limit(1) // Limit query to one document
                .get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;

                unsubscribe = docRef.onSnapshot((snapshot) => {
                    const data = snapshot.data();
                    setFollowersAndFollowingForPassedUser({
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
        getFollowersAndFollowingDataForPassedUser();
        return () => {
            // Unsubscribe when component unmounts
            unsubscribe && unsubscribe();
        };
    }, []);

    // there is issue in this part of code when making the user follow another user for first time.
    const handleFollowing = () => {
        const currentFollowingStatus = !followersAndFollowing?.following?.includes(
            userDataAfterNavigation?.id
        )
        const currentFollowingStatusForPassedUser = !followersAndFollowingForPassedUser.followers.includes(
            firebase.auth().currentUser.email
        )
        db.collection('users')
            .doc(firebase.auth().currentUser.email)
            .collection('following_followers').doc(followersAndFollowing.id).update({
                following: currentFollowingStatus ? firebase.firestore.FieldValue.arrayUnion(
                    userDataAfterNavigation.id
                )
                    : firebase.firestore.FieldValue.arrayRemove(
                        userDataAfterNavigation.id
                    ),
            }).then(() => {
                db.collection('users')
                    .doc(userDataAfterNavigation.id)
                    .collection('following_followers').doc(followersAndFollowingForPassedUser.id).update({
                        followers: currentFollowingStatusForPassedUser ? firebase.firestore.FieldValue.arrayUnion(
                            firebase.auth().currentUser.email
                        )
                            : firebase.firestore.FieldValue.arrayRemove(
                                firebase.auth().currentUser.email
                            ),
                    })
            }).catch(error => {
                console.error('Error updating document: ', error)
            })
    }
    return (
        <View style={{ flexDirection: "column", }}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ width: "30%", justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: userDataAfterNavigation.profile_picture, cache: "force-cache" }}
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
                        cachePolicy={"memory-disk"} />
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
                            {Object.keys(followersAndFollowingForPassedUser?.followers || 0).length}
                        </Text>
                        <Text style={{ color: "#cccccc" }}>
                            followers
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowingForPassedUser?.following || 0).length}
                        </Text>
                        <Text style={{ color: "#cccccc" }}>
                            following
                        </Text>
                    </View>
                </View>
            </View>
            {/* Will be connected to DB soon */}
            {userDataAfterNavigation.displayed_name &&
                <View style={{ marginHorizontal: 20, maxHeight: 50, }} >
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                        {userDataAfterNavigation.displayed_name}
                    </Text>
                </View>
            }
            {userDataAfterNavigation.bio &&
                <View style={{ marginHorizontal: 20, maxHeight: 50 }} >
                    <Text style={{ color: "#fff" }}>
                        {userDataAfterNavigation.bio}
                    </Text>
                </View>
            }
            {userDataAfterNavigation.link &&
                <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 20, marginTop: 5, maxHeight: 50, flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end" }}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={{ color: "#d8e0fa" }}>
                        {extractDomain(userDataAfterNavigation.link)}
                    </Text>
                    <SvgComponent svgKey="LinkSVG" width={moderateScale(18)} height={moderateScale(18)} />
                </TouchableOpacity>
            }
            <View style={{
                justifyContent: "space-around",
                flexDirection: "row",
                marginHorizontal: 20,
                gap: 10,
            }} >
                {/* this must handle the followers. */}
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleFollowing()}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: isUserFollowed ? "#1C1C1E" : "#0E7AFE",
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: isUserFollowed ? "#1C1C1E" : "#0E7AFE",
                        paddingVertical: 8,
                        width: 180,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: "#ffffff",
                            textAlign: "center"
                        }}> {isUserFollowed ? "Unfollow" : "Follow"}</Text>
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
                    <WebView source={{ uri: userDataAfterNavigation.link }} />
                </View>
            </Modal>
        </View>
    )
}

export default OthersProfileContent