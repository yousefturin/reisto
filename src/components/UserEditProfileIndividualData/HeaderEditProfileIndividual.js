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




import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import Modal from 'react-native-modal';

const HeaderEditProfileIndividual = ({ headerTitle, navigation, handleSubmit, isValid, theme, t, prevValue, values }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleGoingBack = () => {
        // Adding Keyboard.dismiss() here will prevent the keyboard from flashing when going back.
        if (prevValue === values) navigation.goBack()
        else {
            Keyboard.dismiss();
            setIsModalVisible(!isModalVisible);
        }
    }

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity style={{ margin: 10, }} onPress={() => handleGoingBack()}>
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 20, marginLeft: 15 }}>{headerTitle}</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={handleSubmit} disabled={!isValid || prevValue === values}>
                    <Text style={{ color: !isValid || prevValue === values ? theme.textQuaternary : theme.appPrimary, fontWeight: "600", fontSize: 20, }}>{t('screens.profile.text.profileEdit.onCancel.done')}</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color={theme.dividerPrimary} />
            <ModalAlert t={t} theme={theme} navigation={navigation} handleGoingBack={handleGoingBack} isModalVisible={isModalVisible} />
        </>
    )
}

const ModalAlert = ({ navigation, handleGoingBack, isModalVisible, theme, t }) => {
    const screenHeight = Dimensions.get('window').height;

    return (
        <Modal
            isVisible={isModalVisible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            style={{
                justifyContent: 'center',
                margin: 0,
            }}>
            <View style={{
                backgroundColor: theme.SubPrimary,
                height: screenHeight * 0.28,
                borderRadius: 20,
                marginHorizontal: 60
            }}>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", flex: 0.6, paddingHorizontal: 20, }}>
                    <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "600", }}>{t('screens.profile.text.profileEdit.onCancel.title')}</Text>
                    <Text style={{ fontSize: 16, color: theme.textTertiary, fontWeight: "400", textAlign: "center", }}>{t('screens.profile.text.profileEdit.onCancel.warning')}</Text>
                </View>

                <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                <View style={{ justifyContent: "space-evenly", flex: 0.4 }}>
                    <TouchableOpacity
                        onPress={() => {
                            handleGoingBack();
                            navigation.goBack();
                        }}>
                        <Text style={{ color: theme.appPrimary, fontWeight: "600", fontSize: 18, textAlign: "center", }}>{t('screens.profile.text.profileEdit.onCancel.discard')}</Text>
                    </TouchableOpacity>
                    <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                    <TouchableOpacity
                        onPress={() => handleGoingBack()}>
                        <Text style={{ color: theme.Primary === "#050505" ? theme.textQuaternary : theme.textPrimary, fontWeight: "400", fontSize: 18, textAlign: "center", }}>{t('screens.profile.text.profileEdit.onCancel.keep')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


export default HeaderEditProfileIndividual