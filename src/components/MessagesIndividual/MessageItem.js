import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculator';
import { CalculateCreateAt } from '../../utils/TimeBasedOnCreatedAt';
import { Image } from 'expo-image';
import { blurHash } from '../../../assets/HashBlurData';

const MessageItem = ({ message, currentUser }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);

    if (currentUser?.owner_uid == message.owner_id) {
        //this message is sent by me
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10, marginRight: 10 }}>
                <View style={{ alignItems: 'flex-end', maxWidth: '80%', }}>
                    {message.image &&
                        <View style={{ height: 259, borderRadius: 20, margin: 10, overflow: 'hidden' }}>
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
                        </View>
                    }
                    {message?.text !== null &&
                        <>
                            <View style={{ zIndex: 999, backgroundColor: '#007AFF', borderRadius: 15, borderBottomRightRadius: 10, alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 16, padding: 10, paddingBottom: 0, letterSpacing: -0.1, }}>
                                    {message?.text}
                                </Text>
                                {/* this is a sketchy way of doing it, but it works */}
                                {message?.seenBy.length === 2 ? (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={'#b2b2b9'} />
                                        <Text style={{ color: "#b2b2b9", fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                        <SvgComponent svgKey="CheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={'#b2b2b9'} />
                                        <Text style={{ color: "#b2b2b9", fontSize: 10, fontWeight: "400" }}>{message?.createdAt ? CalculateCreateAt(message.createdAt) : '  '}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={{
                                zIndex: 0, width: 0, height: 0,
                                borderTopWidth: 10, borderTopColor: 'transparent',
                                borderRightWidth: 15, borderRightColor: '#007AFF',
                                borderBottomWidth: 10, borderBottomColor: 'transparent',
                                transform: [{ rotate: '90deg' }], marginTop: -20,
                                marginRight: -1
                            }} />
                        </>
                    }
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10, marginLeft: 10 }}>
                <View style={{ alignItems: 'flex-start', maxWidth: '80%', }}>
                    <View style={{ zIndex: 999, backgroundColor: '#262626', borderRadius: 15, borderBottomLeftRadius: 10, }}>
                        <Text style={{ color: "#fff", fontSize: 16, padding: 10, paddingBottom: 0, letterSpacing: -0.1, alignSelf: "flex-start" }}>
                            {message?.text}
                        </Text>
                        {/* this is a sketchy way of doing it, but it works */}
                        {message?.seenBy.length === 2 ? (
                            <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                <SvgComponent svgKey="doubleCheckSVG" width={moderateScale(10)} height={moderateScale(10)} stroke={'#b2b2b9'} />
                                <Text style={{ color: "#b2b2b9", fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                            </View>
                        ) : (
                            <View style={{ alignSelf: "flex-end", flexDirection: "row", marginHorizontal: 10, margin: 3 }}>
                                <SvgComponent svgKey="CheckSVG" width={moderateScale(10)} height={moderateScale(10)} fill={'#b2b2b9'} />
                                <Text style={{ color: "#b2b2b9", fontSize: 10, fontWeight: "400" }}>{CalculateCreateAt(message.createdAt)}</Text>
                            </View>
                        )}
                    </View>
                    <View style={{
                        zIndex: 0, width: 0, height: 0,
                        borderTopWidth: 10, borderTopColor: 'transparent',
                        borderRightWidth: 15, borderRightColor: '#262626',
                        borderBottomWidth: 10, borderBottomColor: 'transparent',
                        transform: [{ rotate: '90deg' }], marginTop: -20,
                        marginLeft: -1
                    }} />

                </View>
            </View>
        )
    }
}

export default MessageItem