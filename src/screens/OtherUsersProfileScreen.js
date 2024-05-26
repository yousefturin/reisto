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
    // const navigation = useNavigation();
    // // remove the justSeenPost from the navigation params so that it doesn't show up again
    // useFocusEffect( // This hook is used to handle the screen focus event<---need fix to remove development error (The action 'SET_PARAMS' with payload {"params":{"justSeenPost":null}} was not handled by any navigator.)
    //     React.useCallback(() => {
    //         // This will be called when the screen is focused
    //         return () => {
    //             if (route.params?.justSeenPost !== undefined) {
    //                 navigation.setParams({ justSeenPost: null });
    //             }
    //             // This will be called when the screen is unfocused
    //         };
    //     }, [navigation])
    // );
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
