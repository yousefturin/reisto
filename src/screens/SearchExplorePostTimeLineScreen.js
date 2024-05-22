import { Dimensions, SafeAreaView, View, VirtualizedList } from 'react-native'
import React, { useCallback, useRef } from 'react'
import Post from '../components/Home/Post'
import SavedPostsHeader from '../components/SavedPosts/SavedPostsHeader';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
import usePosts from '../hooks/usePosts';
import useShare from '../hooks/useShare';


const SearchExplorePostTimeLineScreen = ({ route }) => {
    const { t } = useTranslation();
    const { userData, scrollToPostId, fromWhere, searchQuery } = route.params;
    const { posts, loading } = usePosts(fromWhere, searchQuery);
    const { usersForSharePosts } = useShare();
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })
    const searchHeader = t('screens.profile.profileSavedPostsTimeLineHeader')
    const flatListRef = useRef();


    const renderItem = useCallback(({ item }) => {
        return (
            <Post post={item} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
        )
    }, [usersForSharePosts]);

    const handleScrollToIndexFailed = info => {
        const offset = info.averageItemLength * info.index;
        setTimeout(() => { flatListRef.current?.scrollToIndex({ index: info.index, animated: false, }); }, 10);
        flatListRef.current?.scrollToOffset({ offset: offset, animated: false });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <SavedPostsHeader header={searchHeader} theme={theme} />
            {loading === false ? (
                <VirtualizedList
                    onContentSizeChange={() => {
                        if (flatListRef.current && scrollToPostId && posts && posts.length) {
                            flatListRef.current.scrollToIndex({ index: scrollToPostId });
                        }
                    }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={'always'}
                    ref={flatListRef}
                    data={posts}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 35 }}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    getItem={(data, index) => data[index]}
                    getItemCount={data => data.length}
                    initialNumToRender={posts.length}
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

export default SearchExplorePostTimeLineScreen



