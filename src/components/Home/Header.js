import { View, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useContext } from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { useNavigation } from '@react-navigation/native';
import { MessagesNumContext } from '../../context/MessagesNumProvider';
import { colorPalette } from '../../Config/Theme';

const { moderateScale } = initializeScalingUtils(Dimensions);

const Header = ({ theme, onButtonClick }) => {
  const navigation = useNavigation();
  const { messagesNum, loadingMessagesNum } = useContext(MessagesNumContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onButtonClick()} >
        <SvgComponent svgKey="LogoSVG" width={moderateScale(60)} height={moderateScale(60)} fill={theme.textPrimary} />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MessagingMain')}>
          <View style={[styles.unreadBadge, { backgroundColor: loadingMessagesNum ? ("transparent") : messagesNum !== 0 ? "tomato" : "transparent" }]}>

            <Text style={styles.unreadBadgeText}>{messagesNum !== 0 ? messagesNum : null}</Text>
          </View>
          <SvgComponent svgKey="ChatSVG" width={moderateScale(22)} height={moderateScale(22)} fill={theme.textPrimary} stroke={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  unreadBadge: {
    position: "absolute",
    left: 10,
    bottom: 11,
    width: 20,
    height: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  unreadBadgeText: {
    color: colorPalette.dark.textPrimary,
    fontWeight: "600",
  },
});
export default Header