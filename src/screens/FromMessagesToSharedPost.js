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