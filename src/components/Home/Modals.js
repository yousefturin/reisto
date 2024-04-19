import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import SvgComponent from "../../utils/SvgComponents";
import initializeScalingUtils from "../../utils/NormalizeSize"
import { Divider } from 'react-native-elements';
import { firebase, db } from '../../firebase'
import ReactNativeModal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native";

const screenHeight = Dimensions.get('window').height;
const { moderateScale } = initializeScalingUtils(Dimensions);

export const ModalContentForUserWithSameId = ({ handleSavedPost, savedPosts, post, setIsModalVisible, setIsAlertModaVisible, isAlertModaVisible }) => {
    const [postToBeDeleted, setPostToBeDeleted] = useState([])
    const isPostSaved = savedPosts?.saved_post_id?.includes(post.id) || false;
    const handleBeforeSavePost = (post) => {
        handleSavedPost(post)
        // show the users the changes in the ui then close it
        setTimeout(() => {
            setIsModalVisible(false);
        }, 300);
    }
    const handelBeforeDeletePost = (post) => {
        setPostToBeDeleted(post)
        setIsAlertModaVisible(!isAlertModaVisible)
    }
    const handlePostDeleteConfirmed = () => {
        // console.log(postToBeDeleted)
        db.collection('users').doc(firebase.auth().currentUser.email)
            .collection('posts')
            .doc(post.id).delete().then(() => {
                setIsAlertModaVisible(false)
                setIsModalVisible(false)
                console.log('Document successfully updated!');
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
    }
    return (
        <>
            {/* if the backgroundColor is not on the TouchableOpacity then it wont change the active opacity of that background,
                so this code was changed so that each button will have the background prop instead of the View parent */}
            <View style={{ marginHorizontal: 10, marginVertical: 10, marginTop: 25, gap: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                    <TouchableOpacity onPress={() => handleBeforeSavePost(post)}
                        activeOpacity={0.7} style={{ flex: 0.45, alignItems: "center", backgroundColor: "#4c4c4c", gap: 7, borderRadius: 10, paddingVertical: 10 }} >
                        <SvgComponent svgKey={isPostSaved ? "BookMarkSavedSVG" : "BookmarkNotActiveSVG"} width={moderateScale(20)} height={moderateScale(20)} />
                        <Text style={{ fontSize: 13, color: "#fff", fontWeight: "400" }}>{isPostSaved ? "Unsave" : "Save"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.45, alignItems: "center", backgroundColor: "#4c4c4c", gap: 7, borderRadius: 10, paddingVertical: 10 }} >
                        <SvgComponent svgKey="EditSVG" width={moderateScale(20)} height={moderateScale(20)} />
                        <Text style={{ fontSize: 13, color: "#fff", fontWeight: "400" }}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, margin: 10, }}>
                    <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center", backgroundColor: "#4c4c4c", borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 20 }} >
                        <SvgComponent svgKey="CommentSVG" width={moderateScale(22)} height={moderateScale(22)} />
                        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "400", padding: 20 }}>Turn on commenting</Text>
                    </TouchableOpacity>
                    <View style={{}}>
                        <Divider width={0.5} orientation='horizontal' color="#575757" />
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center", backgroundColor: "#4c4c4c", paddingHorizontal: 20 }} >
                        <SvgComponent svgKey="LikeNotActiveSVG" width={moderateScale(22)} height={moderateScale(22)} />
                        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "400", padding: 20 }}>Hide like count</Text>
                    </TouchableOpacity>
                    <View style={{}}>
                        <Divider width={0.5} orientation='horizontal' color="#575757" />
                    </View>
                    <TouchableOpacity onPress={() => handelBeforeDeletePost(post)}
                        activeOpacity={0.7} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center", backgroundColor: "#4c4c4c", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingHorizontal: 20 }} >
                        <SvgComponent svgKey="DeleteSVG" width={moderateScale(22)} height={moderateScale(22)} />
                        <Text style={{ fontSize: 18, color: "#ed4535", fontWeight: "400", padding: 20 }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ModalAlertForDelete isAlertModaVisible={isAlertModaVisible} setIsAlertModaVisible={setIsAlertModaVisible} setIsModalVisible={setIsModalVisible} onPostDeleteConfirmed={handlePostDeleteConfirmed} />
        </>
    )
}

export const ModalContentForUserWithDifferentSameId = ({ handleSavedPost, savedPosts, post, setIsModalVisible }) => {
    const navigation = useNavigation();
    const isPostSaved = savedPosts?.saved_post_id?.includes(post.id) || false;
    const handleBeforeSavePost = (post) => {
        handleSavedPost(post)
        // show the users the changes in the ui then close it
        setTimeout(() => {
            setIsModalVisible(false);
        }, 300);
    }
    const handleAboutThisUser = (post) => {
        setIsModalVisible(false);
        navigation.navigate('AboutThisUser', { ownerID: post.owner_uid })
    }
    return (
        <>
            <View style={{ marginHorizontal: 10, marginVertical: 10, marginTop: 25, gap: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>
                    <TouchableOpacity onPress={() => handleBeforeSavePost(post)}
                        activeOpacity={0.7} style={{ flex: 0.45, alignItems: "center", backgroundColor: "#4c4c4c", gap: 7, borderRadius: 10, paddingVertical: 10 }} >
                        <SvgComponent svgKey={isPostSaved ? "BookMarkSavedSVG" : "BookmarkNotActiveSVG"} width={moderateScale(20)} height={moderateScale(20)} />
                        <Text style={{ fontSize: 13, color: "#fff", fontWeight: "400" }}>{isPostSaved ? "Unsave" : "Save"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.45, alignItems: "center", backgroundColor: "#4c4c4c", gap: 7, borderRadius: 10, paddingVertical: 10 }} >
                        <SvgComponent svgKey="EyePasswordSVG" width={moderateScale(20)} height={moderateScale(20)} />
                        <Text style={{ fontSize: 13, color: "#fff", fontWeight: "400" }}>Not Interested</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, margin: 10, }}>
                    <TouchableOpacity
                        onPress={() => handleAboutThisUser(post)}
                        activeOpacity={0.7} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center", backgroundColor: "#4c4c4c", borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 20 }} >
                        <SvgComponent svgKey="UserIllustrationSVG" width={moderateScale(22)} height={moderateScale(22)} />
                        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "400", padding: 20 }}>About this account</Text>
                    </TouchableOpacity>
                    <View style={{}}>
                        <Divider width={0.5} orientation='horizontal' color="#575757" />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7} style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10, alignItems: "center", backgroundColor: "#4c4c4c", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingHorizontal: 20 }} >
                        <SvgComponent svgKey="ReportIssueSVG" width={moderateScale(22)} height={moderateScale(22)} />
                        <Text style={{ fontSize: 18, color: "#ed4535", fontWeight: "400", padding: 20 }}>Report</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

//#region  Modal header
export const ModalHeader = () => (
    <>
        <View style={{
            height: 5,
            width: 40,
            borderRadius: 10,
            marginTop: 10,
            shadowColor: "black",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            backgroundColor: "#727272",
            alignSelf: "center"
        }} />
    </>
)
//#endregion

//#region Modal Delete confirmation
const ModalAlertForDelete = ({ isAlertModaVisible, setIsAlertModaVisible, setIsModalVisible, onPostDeleteConfirmed }) => {
    const handelDeletingPost = () => {
        onPostDeleteConfirmed()
    }
    return (
        <ReactNativeModal
            isVisible={isAlertModaVisible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            style={{
                justifyContent: 'center',
                margin: 0,
            }}>
            <View style={{
                backgroundColor: "#262626",
                height: screenHeight * 0.28,
                borderRadius: 20,
                marginHorizontal: 60
            }}>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", flex: 0.6, paddingHorizontal: 20, }}>
                    <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600", }}>Delete post?</Text>
                    <Text style={{ fontSize: 16, color: "#656565", fontWeight: "400", textAlign: "center", }}>This post will be permanently deleted. You will not be able to restore it after deletion.</Text>
                </View>

                <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                <View style={{ justifyContent: "space-evenly", flex: 0.4 }}>
                    <TouchableOpacity
                        onPress={() => {
                            handelDeletingPost()
                        }}
                    >
                        <Text style={{ color: "#ed4535", fontWeight: "600", fontSize: 18, textAlign: "center", }}>Delete</Text>
                    </TouchableOpacity>
                    <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                    <TouchableOpacity
                        onPress={() => {
                            setIsModalVisible(false)
                            setTimeout(() => {
                                setIsAlertModaVisible(false)
                            }, 250);
                        }}>
                        <Text style={{ color: "#dfdfdf", fontWeight: "400", fontSize: 18, textAlign: "center", }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    )
}
//#endregion