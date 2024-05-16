import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { blurHash } from '../../../assets/HashBlurData'
import UploadImageToStorage from '../../utils/UploadImageToStorage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { db, firebase } from '../../firebase';
import { Image } from 'expo-image';
import { colorPalette } from '../../Config/Theme';
const EditProfileImage = ({ userData, theme, t }) => {
    const [image, setImage] = useState(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 300 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            const base64Image = await UploadImageToStorage(compressedImage.uri);
            if (base64Image) {
                const unsubscribe = db.collection('users').doc(firebase.auth().currentUser.email)
                    .update({
                        profile_picture: base64Image
                    }).then(() => {
                        console.log('Document successfully updated comments!')
                    }).catch(error => {
                        console.error('Error updating document: ', error)
                    })

                return unsubscribe
            }
        }
    };
    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => pickImage()}>
                {image ? (
                    <Image source={{ uri: image, cache: "force-cache" }}
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            margin: 20,
                            borderWidth: 1.5,
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        transition={50}
                    />
                ) : (
                    <Image source={{ uri: userData.profile_picture, cache: "force-cache" }}
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            margin: 20,
                            borderWidth: 1.5,
                            borderColor: theme.Secondary
                        }}
                        placeholder={blurHash}
                        contentFit="cover"
                        transition={50}
                    />
                )}

            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage()} activeOpacity={0.9}>
                <Text style={{ color: theme.appPrimary, fontWeight: "600", fontSize: 16, textAlign: "center", marginBottom: 18 }}>{t('screens.profile.text.profileEdit.profilePicture')}</Text>
            </TouchableOpacity>
        </View>
    )

}

export default EditProfileImage