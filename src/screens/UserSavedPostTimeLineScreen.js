import { SafeAreaView, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
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
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 100);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };

    const renderItem = useCallback(({ item }) => {
        return (
            <View style={{ height: 660 }}>
                <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
            </View>
        )
    }, []);

    useEffect(() => {
        if (flatListRef.current && scrollToPostId && savedPosts && savedPosts.length) {
            flatListRef.current.scrollToIndex({
                index: scrollToPostId, viewOffset: 0,
                viewPosition: 0
            });
        }
    }, [scrollToPostId])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <SavedPostsHeader header={profileSavedPostsTimeLineHeader} theme={theme} />
            {loading === false ? (
                <VirtualizedList
                    pagingEnabled
                    snapToInterval={660}
                    snapToAlignment="start"
                    decelerationRate="fast"
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
                    initialScrollIndex={scrollToPostId}
                    getItemLayout={(data, index) => ({
                        length: 660,
                        offset: 660 * index,
                        index
                    })}
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
