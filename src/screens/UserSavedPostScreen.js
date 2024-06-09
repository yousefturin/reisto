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




import { SafeAreaView, View } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '../context/UserDataProvider';
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import SavedPostsGrid from '../components/SavedPosts/SavedPostsGrid';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder';
import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
import useFastSavedPosts from '../hooks/useFastSavedPosts';

const UserSavedPostScreen = () => {
    const { t } = useTranslation();
    const userData = useContext(UserContext);
    const { savedPosts, loading, afterLoading } = useFastSavedPosts();

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const savedPostHeader = t('screens.profile.profileSavedHeader')


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <>
                <SavedPostsHeader header={savedPostHeader} theme={theme} />
                {loading === true ? (
                    <LoadingPlaceHolder theme={theme} />

                ) : (
                    <SavedPostsGrid fromWhereValue={0} posts={savedPosts} userData={userData} navigateToScreen={"SavedPosts"} />
                )}

                {afterLoading === true && loading === false && (
                    <View style={{ minHeight: 800 }}>
                        <EmptyDataParma SvgElement={"BookmarkIllustration"} theme={theme} t={t} dataMessage={"You can save posts across Reisto and organize them into collections."} TitleDataMessage={"Nothing saved yet"} />
                    </View>
                )}
            </>
        </SafeAreaView>
    )
}


export default UserSavedPostScreen