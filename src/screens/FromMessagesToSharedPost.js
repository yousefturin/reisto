import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { db, firebase } from '../firebase';
import Post from '../components/Home/Post';
import { UserContext } from '../context/UserDataProvider';
import LoadingPlaceHolder from '../components/Home/LoadingPlaceHolder';
import { useNavigation } from '@react-navigation/native';
import SvgComponent from '../utils/SvgComponents';
import initializeScalingUtils from '../utils/NormalizeSize';
import { colorPalette } from '../Config/Theme';
import { useTheme } from '../context/ThemeContext';

import { useTranslation } from 'react-i18next';
import UseCustomTheme from '../utils/UseCustomTheme';

const { moderateScale } = initializeScalingUtils(Dimensions);

const FromMessagesToSharedPost = ({ route }) => {
    const { t } = useTranslation();
    const { postId, userID } = route.params; // Get the postId from the route params
    const userData = useContext(UserContext);
    const [usersForSharePosts, setUsersForSharePosts] = useState([]);


    const [post, setPost] = useState([]) // Initialize the post state with an empty array

    const { selectedTheme } = useTheme();
    const theme = UseCustomTheme(selectedTheme, { colorPaletteDark: colorPalette.dark, colorPaletteLight: colorPalette.light })


    useEffect(() => {
        let unsubscribe
        const fetchUserPosts = () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const query = db.collection('users').doc(userID)
                    .collection('posts').doc(postId)

                unsubscribe = query.onSnapshot(async snapshot => {
                    const dbUserPostData = snapshot.data();
                    try {
                        const userDoc = await db.collection('users').doc(dbUserPostData.owner_email).get()
                        const dbUserData = userDoc.data()
                        const dbUserProfilePicture = dbUserData.profile_picture
                        const postWithProfilePicture = {
                            id: snapshot.id,
                            profile_picture: dbUserProfilePicture,
                            ...dbUserPostData
                        };
                        setPost(postWithProfilePicture);
                    } catch (error) {
                        console.error('Error fetching user document:', error)
                        setPost({
                            id: snapshot.id,
                            ...dbUserPostData
                        });
                    }
                })
            }
            else {
                console.error("No authenticated user found.");
                return () => { };
            }
        };
        fetchUserPosts();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    useLayoutEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const querySnapshot = await db.collection('users').doc(firebase.auth().currentUser.email).collection('following_followers').limit(1).get();
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const fetchPromises = [];
                const fetchPromisesSecond = [];

                for (const follower of data.followers) {
                    const fetchPromise = db.collection('users').doc(follower).get();
                    fetchPromises.push(fetchPromise);
                }

                for (const following of data.following) {
                    const fetchPromise = db.collection('users').doc(following).get();
                    fetchPromisesSecond.push(fetchPromise);
                }

                const [followerDocs, followingDocs] = await Promise.all([Promise.all(fetchPromises), Promise.all(fetchPromisesSecond)]);

                const followersData = followerDocs.filter(doc => doc.exists).map(doc => doc.data());
                const followingData = followingDocs.filter(doc => doc.exists).map(doc => doc.data());

                const allUsersData = [...followersData, ...followingData];
                const uniqueUserIds = new Set();
                const filteredUsersData = allUsersData.filter(user => {
                    if (uniqueUserIds.has(user.owner_uid)) {
                        return false;
                    } else {
                        uniqueUserIds.add(user.owner_uid);
                        return true;
                    }
                });

                setUsersForSharePosts(filteredUsersData);
            } else {
                console.log("No document found in the collection.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <SafeAreaView>
            <PostHeader theme={theme} t={t} />
            {post.length !== 0 ? (
                <Post post={post} userData={userData} usersForSharePosts={usersForSharePosts} theme={theme} />
            ) : (<LoadingPlaceHolder fromWhere={"sharedPost"} theme={theme} />
            )}
        </SafeAreaView>
    )
}

const PostHeader = ({ theme, t }) => {
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
                <Text style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.profile.profilePostHeader')}</Text>
            </View>
            <View style={{ margin: 10, width: moderateScale(30) }}>
            </View>
        </View>
    )
}
export default FromMessagesToSharedPost