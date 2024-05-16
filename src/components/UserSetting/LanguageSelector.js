import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal';
import SvgComponent from '../../utils/SvgComponents';
import initializeScalingUtils from '../../utils/NormalizeSize';
import { Divider } from 'react-native-elements';

const LanguageSelector = ({ theme, t, i18n }) => {
    const { moderateScale } = initializeScalingUtils(Dimensions);
    const [isContainerVisible, setContainerVisible] = useState(false);
    const toggleContainer = () => {
        setContainerVisible(!isContainerVisible);
    };

    return (
        <View>
            <View style={{
                justifyContent: 'center',
                textAlign: 'right',
                alignItems: "flex-start",
                marginLeft: 20
            }}>
                <Text style={{
                    color: '#767676',
                    paddingTop: 15,
                    fontSize: 14
                }}>{t('screens.settingOption.language.language')}</Text>
            </View>

            <View style={{
                backgroundColor: theme.SubPrimary,
                borderRadius: 10,
                marginTop: 10,
                shadowColor: theme.Primary === '#050505' ? "black" : 'grey',
                shadowOffset: {
                    width: 0,
                    height: 2.2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                marginHorizontal: 20
            }}>
                <TouchableOpacity
                    style={{
                        padding: 14,
                        marginBottom: 10,
                        flexDirection: "row-reverse",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 4
                    }}
                    activeOpacity={0.7}
                    onPress={toggleContainer}
                >
                    <View style={{
                        width: 24, // Set the size of the circle container
                        height: 24,
                        marginRight: 10, // Spacing between the circle and text
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}>
                        <SvgComponent svgKey={isContainerVisible ? "ArrowUpSVG" : "ArrowDownSVG"} width={moderateScale(30)} height={moderateScale(30)} stroke={theme.textPrimary} />
                    </View>
                    <Text style={{
                        paddingRight: 6,
                        fontSize: 16,
                        color: theme.textPrimary,
                    }}>{t('screens.settingOption.language.SelectLanguage')}</Text>
                </TouchableOpacity>
            </View>
            <ModelLanguage t={t} i18n={i18n} theme={theme} setContainerVisible={setContainerVisible} isContainerVisible={isContainerVisible} moderateScale={moderateScale} />
        </View>
    )
}
const ModelLanguage = ({ isContainerVisible, setContainerVisible, moderateScale, theme, i18n, t, }) => {
    const screenHeight = Dimensions.get('window').height;

    const languageElements = [
        {
            image: require('../../../assets/images/EnglishFlag.png'),
            text: t('screens.settingOption.language.english'),
            action: "en"
        },
        {
            image: require('../../../assets/images/TurkishFlag.png'),
            text: t('screens.settingOption.language.turkish'),
            action: "tr"
        },
        {
            image: require('../../../assets/images/RussianFlag.png'),
            text: t('screens.settingOption.language.russian'),
            action: "ru"
        },
        {
            image: require('../../../assets/images/ArabicFlag.png'),
            text: t('screens.settingOption.language.arabic'),
            action: "ar"
        }
    ];
    return (
        <Modal
            isVisible={isContainerVisible}
            onSwipeComplete={() => setContainerVisible(false)}
            onBackdropPress={() => setContainerVisible(false)}
            swipeDirection="down"
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={{
                backgroundColor: theme.SubPrimary,
                height: screenHeight * 0.38,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }}>
                <ModalNotch theme={theme} />
                <View style={{ margin: 10 }} />
                {languageElements.map((element, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            style={{
                                marginHorizontal: 10,
                                flexDirection: "row", justifyContent: "flex-start",
                                gap: 20, alignItems: "center",
                                backgroundColor: i18n.language === element.action ? theme.modalBtn : "transparent",
                                borderRadius: 10,
                            }} onPress={() => {
                                // if the language is already selected, do not change it to ensure performance optimization
                                i18n.language !== element.action ? i18n.changeLanguage(element.action) : setContainerVisible(!isContainerVisible);
                                setContainerVisible(!isContainerVisible)
                            }}>
                            <Image
                                source={element.image}
                                style={{
                                    width: moderateScale(35),
                                    height: moderateScale(35),
                                    borderRadius: moderateScale(35) / 2,
                                    resizeMode: 'cover',
                                    margin: 15
                                }}
                            />
                            <View style={{ flexDirection: "column", flex: 1, }}>
                                <Text style={{ fontSize: 20, color: theme.textPrimary, fontWeight: "400" }}>{element.text}</Text>
                            </View>
                            {i18n.language === element.action && (
                                <View style={{ marginRight: 15 }}>
                                    <SvgComponent svgKey="DotWithCheckSVG" width={moderateScale(22)} height={moderateScale(22)} fill={theme.textPrimary} />
                                </View>
                            )}
                        </TouchableOpacity>
                        {
                            index !== languageElements.length - 1 && (
                                <View style={{ marginHorizontal: 10 }}>
                                    <Divider width={0.5} orientation='horizontal' color={theme.dividerPrimary} />
                                </View>
                            )
                        }
                    </React.Fragment>
                ))}
            </View>
        </Modal>
    )
}


const ModalNotch = ({ theme }) => (
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
            backgroundColor: theme.notch,
            alignSelf: "center"
        }} />
    </>
)
export default LanguageSelector