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




import { ScrollView, SafeAreaView, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import ProfilePost from '../components/Profile/ProfilePost'
import { RefreshControl } from 'react-native-gesture-handler'
import OthersProfileHeader from '../components/OthersProfile/OthersProfileHeader'
import OthersProfileContent from '../components/OthersProfile/OthersProfileContent'
import LoadingPlaceHolder from '../components/Search/LoadingPlaceHolder'
import { colorPalette } from '../Config/Theme'
import { useTheme } from '../context/ThemeContext'
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma'
import { useTranslation } from 'react-i18next'
import UseCustomTheme from '../utils/UseCustomTheme'
import useFastPosts from '../hooks/useFastPosts'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const OtherUsersProfileScreen = ({ route }) => {
    const { userDataToBeNavigated, justSeenPost } = route.params
    const { t } = useTranslation()
    const [refreshing, setRefreshing] = useState(false);
    const { userPosts, loading, afterLoading, fetchUserSavedPosts } = useFastPosts(null, userDataToBeNavigated.id)
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    // Function to handle scroll event
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const subscription = fetchUserSavedPosts();
        setRefreshing(false);
        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                // Call the unsubscribe function to stop listening to Firestore updates
                subscription.unsubscribe();
            }
        };
    }, []);



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <>
                <OthersProfileHeader userDataToBeNavigated={userDataToBeNavigated} theme={theme} />
                <ScrollView
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <OthersProfileContent t={t} userDataToBeNavigated={userDataToBeNavigated} userPosts={userPosts} theme={theme} />
                    {loading === false && (
                        <ProfilePost t={t} posts={userPosts} justSeenPost={justSeenPost} userDataToBeNavigated={userDataToBeNavigated} keyValue={"NavigationToOtherProfile"} />
                    )}
                    {loading === true && (
                        <LoadingPlaceHolder condition={userPosts.length === 0} theme={theme} />
                        
                    )}

                    {afterLoading === true && loading === false && (<View style={{ minHeight: 250, }}>
                        <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} dataMessage={"This user has not share any post recently."} TitleDataMessage={"Nothing shared yet"} />
                    </View>)}
                </ScrollView>
            </>
        </SafeAreaView>
    )
}

export default OtherUsersProfileScreen
