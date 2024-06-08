/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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