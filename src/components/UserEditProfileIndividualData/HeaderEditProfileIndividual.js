import { View, Text, Dimensions, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';
import Modal from 'react-native-modal';

const HeaderEditProfileIndividual = ({ headerTitle, navigation, handleSubmit, isValid }) => {
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
                    <SvgComponent svgKey="ArrowBackSVG" width={moderateScale(30)} height={moderateScale(30)} />
                </TouchableOpacity>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20, marginLeft: 15 }}>{headerTitle}</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={handleSubmit} disabled={!isValid}>
                    <Text style={{ color: !isValid ? "#dfdfdf" : "#0E7AFE", fontWeight: "600", fontSize: 20, }}>Done</Text>
                </TouchableOpacity>
            </View>
            <Divider width={0.3} orientation='horizontal' color="#2b2b2b" />
            <ModalAlert navigation={navigation} handleGoingBack={handleGoingBack} isModalVisible={isModalVisible} />
        </>
    )
}
const ModalAlert = ({ navigation, handleGoingBack, isModalVisible }) => {
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
                backgroundColor: "#262626",
                height: screenHeight * 0.28,
                borderRadius: 20,
                marginHorizontal: 60
            }}>
                <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", flex: 0.6, paddingHorizontal: 20, }}>
                    <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600", }}>Discard changes?</Text>
                    <Text style={{ fontSize: 16, color: "#656565", fontWeight: "400", textAlign: "center", }}>If you go back now, you will lose your changes.</Text>
                </View>

                <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                <View style={{ justifyContent: "space-evenly", flex: 0.4 }}>
                    <TouchableOpacity
                        onPress={() => {
                            handleGoingBack();
                            navigation.goBack();
                        }}>
                        <Text style={{ color: "#0E7AFE", fontWeight: "600", fontSize: 18, textAlign: "center", }}>Discard changes</Text>
                    </TouchableOpacity>
                    <Divider width={1} orientation='horizontal' color="#2b2b2b" />
                    <TouchableOpacity
                        onPress={() => handleGoingBack()}>
                        <Text style={{ color: "#dfdfdf", fontWeight: "400", fontSize: 18, textAlign: "center", }}>Keep editing</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )
}


export default HeaderEditProfileIndividual