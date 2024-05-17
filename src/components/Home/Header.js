import { View, Dimensions, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native'
import React, { useContext } from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';
import { useNavigation } from '@react-navigation/native';
import { MessagesNumContext } from '../../context/MessagesNumProvider';
import { colorPalette } from '../../Config/Theme';

const { moderateScale } = initializeScalingUtils(Dimensions);

const Header = ({ theme, onButtonClick, opacity }) => {
  const navigation = useNavigation();
  const { messagesNum, loadingMessagesNum } = useContext(MessagesNumContext);
  return (
    <Animated.View style={[styles.container, { opacity: opacity }]}>
      <TouchableOpacity onPress={() => onButtonClick()} style={{ flexDirection: "row",alignItems:"center" }} >
        <SvgComponent svgKey="LogoSVG" width={moderateScale(60)} height={moderateScale(60)} fill={theme.textPrimary} />
        <SvgComponent svgKey="ArrowDownSVG" width={moderateScale(25)} height={moderateScale(25)} fill={theme.textPrimary} stroke={theme.textPrimary} />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MessagingMain')}>
          <View style={[styles.unreadBadge, { backgroundColor: loadingMessagesNum ? ("transparent") : messagesNum !== 0 ? "tomato" : "transparent" }]}>

            <Text style={styles.unreadBadgeText}>{messagesNum !== 0 ? messagesNum : null}</Text>
          </View>
          <SvgComponent svgKey="ChatSVG" width={moderateScale(22)} height={moderateScale(22)} fill={theme.textPrimary} stroke={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
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