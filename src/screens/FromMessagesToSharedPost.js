/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */




import { SafeAreaView } from 'react-native'
import React, { useContext } from 'react'
import Post from '../components/Home/Post';
import { UserContext } from '../context/UserDataProvider';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';
import EmptyDataParma from '../components/CustomComponent/EmptyDataParma';
import useShare from '../hooks/useShare';
import MessagePostHeader from '../components/PostFromMessages/MessagePostHeader';
import usePostFromMessages from '../hooks/usePostFromMessages';


const FromMessagesToSharedPost = ({ route }) => {
    const { t } = useTranslation();
    const { postId, userID } = route.params; // Get the postId from the route params
    const userData = useContext(UserContext);
    const { usersForSharePosts } = useShare();
    const { post, loading } = usePostFromMessages(userID, postId);
    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.Primary }}>
            <MessagePostHeader theme={theme} t={t} />
            {loading === false ? (
                <Post post={post} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
            ) : loading === null ? (
                <EmptyDataParma SvgElement={"DeletedPostIllustration"} theme={theme} t={t} TitleDataMessage={"Post No Longer Available"} dataMessage={"It seems that this post has been removed by the owner."} />
            ) :
                (<LoadingPlaceHolder fromWhere={"sharedPost"} theme={theme} />)

            }
        </SafeAreaView>
    )
}

export default FromMessagesToSharedPost