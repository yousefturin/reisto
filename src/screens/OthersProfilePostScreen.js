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




import { Dimensions, VirtualizedList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef } from 'react'
import Post from '../components/Home/Post'
import SvgComponent from '../utils/SvgComponents'
import initializeScalingUtils from '../utils/NormalizeSize';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from '../context/UserDataProvider';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import useShare from '../hooks/useShare';
import usePosts from '../hooks/usePosts';

const { moderateScale } = initializeScalingUtils(Dimensions);

const OthersProfilePostScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userDataToBeNavigated, scrollToPostId } = route.params;

    const { posts, loading } = usePosts("OthersProfilePostScreen", null, userDataToBeNavigated.id)
    const flatListRef = useRef();
    const userData = useContext(UserContext);
    const { usersForSharePosts } = useShare();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    const handleScrollToIndexFailed = info => {
        const offset = info.averageItemLength * info.index;
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 10);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };

    const renderItem = ({ item }) => (
        <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <OwnerProfileHeader t={t} userDataToBeNavigated={userDataToBeNavigated} theme={theme} />
            {posts.length !== 0 ? (
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
                />
            ) : (
                <LoadingPlaceHolder theme={theme} /> 
                
            )}
        </SafeAreaView>
    )
}

const OwnerProfileHeader = ({ userDataToBeNavigated, theme, t }) => {
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
                <Text style={{ color: theme.textSecondary, fontWeight: "600", fontSize: 12 }}>{userDataToBeNavigated.username.toUpperCase()}</Text>
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.profile.profilePostHeader')}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}

export default OthersProfilePostScreen