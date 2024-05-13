import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import Modal from 'react-native-modal';
import { colorPalette } from '../../Config/Theme';

const HeaderEditProfileIndividual = ({ headerTitle, navigation, handleSubmit, isValid, theme }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleGoingBack = () => {
        //not having the dismiss here will make the go back to flash teh Keyboard for couple seconds.
        Keyboard.dismiss();
        setIsModalVisible(!isModalVisible)
    }
    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity style={{ margin: 10, }} onPress={() => handleGoingBack()}>
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={{ color: theme.textPrimary, fontWeight: "700", fontSize: 20, marginLeft: 15 }}>{headerTitle}</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={handleSubmit} disabled={!isValid}>
                    <Text style={{ color: !isValid ? theme.textQuaternary : theme.appPrimary, fontWeight: "600", fontSize: 20, }}>Done</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color={theme.dividerPrimary} />
            <ModalAlert theme={theme} navigation={navigation} handleGoingBack={handleGoingBack} isModalVisible={isModalVisible} />
        </>
    )
}
const ModalAlert = ({ navigation, handleGoingBack, isModalVisible, theme }) => {
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
                    <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "600", }}>Discard changes?</Text>
                    <Text style={{ fontSize: 16, color: theme.textTertiary, fontWeight: "400", textAlign: "center", }}>If you go back now, you will lose your changes.</Text>
                </View>

                <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                <View style={{ justifyContent: "space-evenly", flex: 0.4 }}>
                    <TouchableOpacity
                        onPress={() => {
                            handleGoingBack();
                            navigation.goBack();
                        }}>
                        <Text style={{ color: theme.appPrimary, fontWeight: "600", fontSize: 18, textAlign: "center", }}>Discard changes</Text>
                    </TouchableOpacity>
                    <Divider width={1} orientation='horizontal' color={theme.dividerPrimary} />
                    <TouchableOpacity
                        onPress={() => handleGoingBack()}>
                        <Text style={{ color: theme.Primary === "#050505" ? theme.textQuaternary : theme.textPrimary, fontWeight: "400", fontSize: 18, textAlign: "center", }}>Keep editing</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )
}


export default HeaderEditProfileIndividual