/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




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
import useFollowing from '../../hooks/useFollowing';
import { Skeleton } from 'moti/skeleton';


const OthersProfileContent = ({ userDataToBeNavigated, userPosts, theme, t }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const { loading, followersAndFollowing, followersAndFollowingForPassedUser } = useFollowing(userDataToBeNavigated.id);

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
                        owner_uid: data.owner_uid
                    };
                    // this was the only way to do it otherwise the useStat wil not be updated when it pass the Params to navigation
                    setUserDataAfterNavigation(userDataNew);
                }, error => {
                    console.error("Error listening to document:", error);
                    return () => { };
                });
                return () => unsubscribe();
            });
        };

        // Call the function here
        GetPostOwnerData(userDataToBeNavigated);
    }, []);


    // there is issue in this part of code when making the user follow another user for first time.<---(not fixed)
    const handleFollowing = () => {
        // console.log("current following:",currentFollowingStatus)
        // console.log("following and follower:",followersAndFollowing.following)
        const currentFollowingStatus = !followersAndFollowing?.following?.includes(
            userDataAfterNavigation?.id
        )
        // console.log("current nav id: ",userDataAfterNavigation?.id)
        // console.log("current following stat: ",currentFollowingStatusForPassedUser)

        // console.log("passedUser:",followersAndFollowingForPassedUser?.followers)
        const currentFollowingStatusForPassedUser = !followersAndFollowingForPassedUser.followers.includes(
            firebase.auth().currentUser.email
        )
        db.collection('users')
        // values need to be check with true, so then it does not give true when there is no value
            .doc(firebase.auth().currentUser.email)
            .collection('following_followers').doc(followersAndFollowing.id).update({
                following: currentFollowingStatus === true ? firebase.firestore.FieldValue.arrayUnion(
                    userDataAfterNavigation.id
                )
                    : firebase.firestore.FieldValue.arrayRemove(
                        userDataAfterNavigation.id
                    ),
            }).then(() => {
                db.collection('users')
                    .doc(userDataAfterNavigation.id)
                    .collection('following_followers').doc(followersAndFollowingForPassedUser.id).update({
                        followers: currentFollowingStatusForPassedUser === true ? firebase.firestore.FieldValue.arrayUnion(
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
    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark' : 'light',
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
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
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        cachePolicy={"memory-disk"} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1, }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(userPosts).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.recipes')}
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowingForPassedUser?.followers || 0).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.followers')}
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 18 }}>
                            {Object.keys(followersAndFollowingForPassedUser?.following || 0).length}
                        </Text>
                        <Text style={{ color: theme.textQuaternary }}>
                            {t('screens.profile.text.profileContent.following')}
                        </Text>
                    </View>
                </View>
            </View>
            {/* Will be connected to DB soon */}
            {userDataAfterNavigation.displayed_name &&
                <View style={{ marginHorizontal: 20, maxHeight: 50, }} >
                    <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        {userDataAfterNavigation.displayed_name}
                    </Text>
                </View>
            }
            {userDataAfterNavigation.bio &&
                <View style={{ marginHorizontal: 20, maxHeight: 50 }} >
                    <Text style={{ color: theme.textPrimary }}>
                        {userDataAfterNavigation.bio}
                    </Text>
                </View>
            }
            {userDataAfterNavigation.link &&
                <TouchableOpacity activeOpacity={0.8} style={{ marginHorizontal: 20, marginTop: 5, maxHeight: 50, flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-end" }}
                    onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Text style={{ color: theme.textURL }}>
                        {extractDomain(userDataAfterNavigation.link)}
                    </Text>
                    <SvgComponent svgKey="LinkSVG" width={moderateScale(18)} height={moderateScale(18)} stroke={theme.textURL} />
                </TouchableOpacity>
            }

            {/* this must handle the followers. */}
            {loading === false ? (
                <View style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    marginHorizontal: 20,
                    gap: 10,
                }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => handleFollowing()}>
                        <View style={{
                            marginTop: 20,
                            backgroundColor: isUserFollowed ? theme.Quinary : theme.appPrimary,
                            borderWidth: 1,
                            borderRadius: 8,
                            borderColor: isUserFollowed ? theme.Quinary : theme.appPrimary,
                            paddingVertical: 8,
                            width: 180,
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: "500",
                                // if user is following and it is white theme make text back, if user does not follow make text white
                                color: theme.Primary === '#050505' ? theme.textPrimary : isUserFollowed ? theme.textPrimary : theme.Primary,
                                textAlign: "center"
                            }}> {isUserFollowed ? t('screens.profile.text.profileContent.unfollow') : t('screens.profile.text.profileContent.follow')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={{
                            marginTop: 20,
                            backgroundColor: theme.Quinary,
                            borderWidth: 1,
                            borderRadius: 8,
                            borderColor: theme.Quinary,
                            paddingVertical: 8,
                            width: 180,
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: theme.textPrimary,
                                textAlign: "center"
                            }}>{t('screens.profile.text.profileContent.shareProfile')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{
                    marginTop: 20,
                    borderRadius: 8,
                    width: 360,
                    height: 35,
                    marginHorizontal: 20,
                    alignSelf: "center",
                }} >
                    <Skeleton
                        show
                        height={33}
                        width={"100%"}
                        {...SkeletonCommonProps}
                    />
                </View>

            )}


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
                    style={{ backgroundColor: theme.SubPrimary, flex: 1 }}
                >
                    <View style={{
                        height: 5,
                        width: 40,
                        backgroundColor: theme.Quinary,
                        borderRadius: 10,
                        marginTop: 10,
                        shadowColor: "black",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        backgroundColor: theme.Tertiary,
                        alignSelf: "center"
                    }} />
                    <View style={{ marginTop: 10 }}></View>
                    <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                    <WebView source={{ uri: userDataAfterNavigation.link }} />
                </View>
            </Modal>
        </View>
    )
}

export default OthersProfileContent