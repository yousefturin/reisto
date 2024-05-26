import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { CalculateCreateAt } from '../../utils/TimeBasedOnCreatedAt';
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';
import { TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const MessageItem = ({ message, currentUser, theme }) => {
    const navigation = useNavigation();
    const { moderateScale } = initializeScalingUtils(Dimensions);

    const handleNavigationFromSharedPostToUserProfile = (data) => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser.uid === data.owner_uid) {
            //navigate to my profile
            navigation.navigate("UserProfile");
        } else {
            //navigate to other user's profile
            const userDataToBeNavigated = {
                ...data, // Copy all properties from item
                id: data.owner_email, // Replace email with id
                username: data.user
            };
            navigation.navigate("OtherUsersProfileScreen", { userDataToBeNavigated: userDataToBeNavigated, justSeenPost: null });
        }
    }

    const handleNavigationFromSharedPostToPost = (postId, userID) => {
        navigation.navigate("FromMessagesToSharedPost", { postId: postId, userID: userID });
    }


    
    if (currentUser?.owner_uid == message.owner_id) {
        //this message is sent by me
        if (message?.type_of_message === "text") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, marginRight: 10 }}>
                    <View style={{ alignItems: 'flex-end', maxWidth: '80%', }}>
                        <View style={{ zIndex: 999, backgroundColor: theme.appPrimary, borderRadius: 15, borderBottomRightRadius: 10, alignItems: "center" }}>
                            <Text style={{ color: theme.Primary === "#050505" ? theme.textPrimary : theme.Primary, fontSize: 16, padding: 10, paddingBottom: 0, letterSpacing: -0.1, }}>
                                {message?.text}
                            </Text>
                            {/* this is a sketchy way of doing it, but it works */}
                            {message?.seenBy.length === 2 ? (
                                <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                    <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                    <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                </View>
                            ) : (
                                <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                    <SvgComponent svgKey="CheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                    <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{message?.createdAt ? CalculateCreateAt(message.createdAt) : '  '}</Text>
                                </View>
                            )}
                        </View>
                        <View style={{
                            zIndex: 0, width: 0, height: 0,
                            borderTopWidth: 10, borderTopColor: 'transparent',
                            borderRightWidth: 15, borderRightColor: theme.appPrimary,
                            borderBottomWidth: 10, borderBottomColor: 'transparent',
                            transform: [{ rotate: '90deg' }], marginTop: -20,
                            marginRight: -1
                        }} />
                    </View>
                </View>
            )
        }
        // need to add a text message incase the image was deleted by the user=> (soon will be implemented) or an issue happened with server.
        if (message?.type_of_message === "image") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, marginRight: 10 }}>
                    <View style={{ alignItems: 'flex-end', maxWidth: '80%', }}>
                        <View style={{ height: 259, borderRadius: 20, marginVertical: 10, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: message?.image, cache: "force-cache" }}
                                style={{
                                    width: 260,
                                    height: 260,
                                    borderRadius: 20,
                                    position: "relative"
                                }}
                                contentFit="contain"
                                placeholder={blurHash}
                                cachePolicy={"memory-disk"}
                                transition={50}
                            // onError={(error) => console.log("error", error)}
                            />
                            <View style={{ position: "absolute", bottom: 7, right: 0, zIndex: 100 }}>
                                {message?.seenBy.length === 2 ? (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                        <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="CheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                        <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{message?.createdAt ? CalculateCreateAt(message.createdAt) : '  '}</Text>
                                    </View>
                                )}
                            </View>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.7)",]}
                                locations={[0.2, 1]}
                                style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: 30, opacity: 0.4, zIndex: 0 }}>
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            )
        }

        if (message?.type_of_message === "share_post") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, marginRight: 10 }}>
                    <View style={{ alignItems: 'flex-end', maxWidth: '80%', }}>
                        <TouchableOpacity onPress={() => handleNavigationFromSharedPostToPost(message.shared_data.id, message.shared_data.owner_email)} activeOpacity={0.9}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.SubPrimary, borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: 10 }} activeOpacity={0.9}
                                onPress={() => handleNavigationFromSharedPostToUserProfile(message.shared_data)}>
                                <Image
                                    source={{ uri: message?.shared_data?.profile_picture, cache: "force-cache" }}
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: theme.Secondary,
                                        margin: 10
                                    }}
                                    placeholder={blurHash}
                                    contentFit="cover"
                                    transition={50}
                                />
                                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16, }}>{message?.shared_data?.user}</Text>
                            </TouchableOpacity>

                            <View style={{ height: 260, width: 260, overflow: 'hidden' }}>
                                <Image
                                    source={{ uri: message?.shared_data?.imageURL, cache: "force-cache" }}
                                    style={{
                                        height: "100%",
                                        overflow: "hidden",
                                    }}
                                    contentFit="cover"
                                    placeholder={blurHash}
                                    cachePolicy={"memory-disk"}
                                    transition={50}
                                />
                            </View>
                            <View style={{ backgroundColor: theme.SubPrimary, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: "row", maxWidth: 260, marginBottom: 10 }}>
                                <Text style={{ color: theme.textPrimary, margin: 10 }} numberOfLines={2} ellipsizeMode="tail">
                                    <Text style={{ fontWeight: "700" }}>{message?.shared_data?.user} </Text>
                                    <Text style={{ color: theme.textSecondary }} >
                                        {message?.shared_data?.caption}
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

    } else {
        //this message belongs to the other user
        if (message?.type_of_message === "text") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, marginLeft: 10 }}>
                    <View style={{ alignItems: 'flex-start', maxWidth: '80%', }}>
                        <View style={{ zIndex: 999, backgroundColor: theme.SubPrimary, borderRadius: 15, borderBottomLeftRadius: 10, }}>
                            <Text style={{ color: theme.textPrimary, fontSize: 16, padding: 10, paddingBottom: 0, letterSpacing: -0.1, alignSelf: "flex-start" }}>
                                {message?.text}
                            </Text>
                            {/* this is a sketchy way of doing it, but it works */}
                            {message?.seenBy.length === 2 ? (
                                <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                    <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                </View>
                            ) : (
                                <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                    <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                </View>
                            )}
                        </View>
                        <View style={{
                            zIndex: 0, width: 0, height: 0,
                            borderTopWidth: 10, borderTopColor: 'transparent',
                            borderRightWidth: 15, borderRightColor: theme.SubPrimary,
                            borderBottomWidth: 10, borderBottomColor: 'transparent',
                            transform: [{ rotate: '90deg' }], marginTop: -20,
                            marginLeft: -1
                        }} />
                    </View>
                </View>
            )
        }

        if (message?.type_of_message === "image") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, marginLeft: 10 }}>
                    <View style={{ alignItems: 'flex-start', maxWidth: '80%', }}>
                        <View style={{ height: 259, borderRadius: 20, marginVertical: 10, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: message?.image, cache: "force-cache" }}
                                style={{
                                    width: 260,
                                    height: 260,
                                    borderRadius: 20,
                                }}
                                contentFit="contain"
                                placeholder={blurHash}
                                cachePolicy={"memory-disk"}
                                transition={50}
                            />
                            <View style={{ position: "absolute", bottom: 7, right: 0, zIndex: 10 }}>
                                {message?.seenBy.length === 2 ? (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                        <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="CheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={theme.textQuinary} />
                                        <Text style={{ color: theme.textQuinary, fontSize: 10, fontWeight: "400" }}>{message?.createdAt ? CalculateCreateAt(message.createdAt) : '  '}</Text>
                                    </View>
                                )}
                            </View>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.7)",]}
                                locations={[0.2, 1]}
                                style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: 30, opacity: 0.4, zIndex: 0 }}>
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            )
        }

        if (message?.type_of_message === "share_post") {
            return (
                <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, marginLeft: 10 }}>
                    <View style={{ alignItems: 'flex-start', maxWidth: '80%', }}>
                        <TouchableOpacity onPress={() => handleNavigationFromSharedPostToPost(message.shared_data.id, message.shared_data.owner_email)} activeOpacity={0.9}>
                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.SubPrimary, borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: 10 }} activeOpacity={0.9}
                                onPress={() => handleNavigationFromSharedPostToUserProfile(message.shared_data)}>
                                <Image
                                    source={{ uri: message?.shared_data?.profile_picture, cache: "force-cache" }}
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: theme.Secondary,
                                        margin: 10
                                    }}
                                    placeholder={blurHash}
                                    contentFit="cover"
                                    transition={50}
                                />
                                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 16, }}>{message?.shared_data?.user}</Text>
                            </TouchableOpacity>

                            <View style={{ height: 260, width: 260, overflow: 'hidden' }}>
                                <Image
                                    source={{ uri: message?.shared_data?.imageURL, cache: "force-cache" }}
                                    style={{
                                        height: "100%",
                                        overflow: "hidden",
                                    }}
                                    contentFit="cover"
                                    placeholder={blurHash}
                                    cachePolicy={"memory-disk"}
                                    transition={50}
                                />
                            </View>
                            <View style={{ backgroundColor: theme.SubPrimary, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: "row", maxWidth: 260, marginBottom: 10 }}>
                                <Text style={{ color: theme.textPrimary, margin: 10 }} numberOfLines={2} ellipsizeMode="tail">
                                    <Text style={{ fontWeight: "700" }}>{message?.shared_data?.user} </Text>
                                    <Text style={{ color: theme.textSecondary }} >
                                        {message?.shared_data?.caption}
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
}

export default MessageItem