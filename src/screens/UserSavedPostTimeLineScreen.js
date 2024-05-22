import { SafeAreaView, VirtualizedList } from 'react-native'
import React, { useCallback, useRef } from 'react'
import Post from '../components/Home/Post'
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
import useShare from '../hooks/useShare';
import useSavedPosts from '../hooks/useSavedPosts';


const UserSavedPostTimeLineScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData, scrollToPostId } = route.params;
    const flatListRef = useRef();
    const { usersForSharePosts } = useShare();
    const { savedPosts, loading } = useSavedPosts()

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const profileSavedPostsTimeLineHeader = t('screens.profile.profileSavedPostsTimeLineHeader')

    const handleScrollToIndexFailed = info => {
        const offset = info.averageItemLength * info.index;
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 10);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };

    const renderItem = useCallback(({ item }) => {
        return (
            <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
        )
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <SavedPostsHeader header={profileSavedPostsTimeLineHeader} theme={theme} />
            {loading === false ? (
                <VirtualizedList
                    onContentSizeChange={() => {
                        if (flatListRef.current && scrollToPostId && savedPosts && savedPosts.length) {
                            flatListRef.current.scrollToIndex({ index: scrollToPostId });
                        }
                    }}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 35 }}

                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={savedPosts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    getItem={(data, index) => data[index]}
                    getItemCount={data => data.length}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                />
            ) : loading === null ? (
                <View style={{ minHeight: 800 }}>
                    <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} dataMessage={"Check your internet connection, and refresh the page."} TitleDataMessage={"Something went wrong"} />
                </View>
            ) : (
                <LoadingPlaceHolder theme={theme} />
            )}
        </SafeAreaView>
    )
}

export default UserSavedPostTimeLineScreen
