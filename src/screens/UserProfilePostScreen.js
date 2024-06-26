/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import { Dimensions, SafeAreaView, Text, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import Post from '../components/Home/Post'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize';
import { firebase } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
import useShare from '../hooks/useShare';
import usePosts from '../hooks/usePosts';



const { moderateScale } = initializeScalingUtils(Dimensions);

const UserProfilePostScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData, scrollToPostId } = route.params;

    const flatListRef = useRef();
    const { usersForSharePosts } = useShare();
    const user = firebase.auth().currentUser;
    const { posts, loading } = usePosts("UserProfilePostScreen", null, user.email)

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    const handleScrollToIndexFailed = info => {
        const offset = info.averageItemLength * info.index;
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 10);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };
        //<-(FIXED)
             // TODO: when click to see more is clicked, it goes under the post due to the height of the post being fixed to 660, which is used for scroll to index        
    const renderItem = useCallback(({ item }) => {
        return (
            <View style={{   }}>
                <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
            </View>
        )
    }, [posts]);

    useEffect(() => {
        if (flatListRef.current && scrollToPostId && posts && posts.length) {
            flatListRef.current.scrollToIndex({
                index: scrollToPostId, viewOffset: 0,
                viewPosition: 0
            });
        }
    }, [scrollToPostId])
    // (TODO) onContentSizeChange must be removed from VirtualizedList.<-(FIXED)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <OwnerProfileHeader userData={userData} theme={theme} t={t} />
            {loading === false ? (
                <VirtualizedList
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 35 }}
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    getItem={(data, index) => data[index]}
                    getItemCount={data => data.length}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                    initialScrollIndex={scrollToPostId}
                    getItemLayout={(data, index) => ({
                        length: 660,
                        offset: 660 * index,
                        index,
                    })}
                />
            ) : loading === null ? (
                <View style={{ minHeight: 800 }}>
                    <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} dataMessage={"Check your internet connection, and refresh the page."} TitleDataMessage={"Something went wrong"} />
                </View>
            ) : (
                <LoadingPlaceHolder theme={theme} />

            )
            }
        </SafeAreaView>
    )
}

const OwnerProfileHeader = ({ userData, theme, t }) => {
    const navigation = useNavigation();

    const handlePressBack = () => {
        navigation.goBack()
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
            <TouchableOpacity style={{ margin: 10 }} onPress={() => { handlePressBack() }}>
                <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 12 }}>{userData.username.toUpperCase()}</Text>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.profile.profilePostHeader')}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default UserProfilePostScreen
