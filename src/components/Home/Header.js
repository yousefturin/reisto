import { View, Dimensions, StyleSheet, TouchableOpacity,Text } from 'react-native'
import React from 'react'
import SvgComponent from '../../utils/SvgComponents'
import initializeScalingUtils from '../../utils/NormalizeSize';

const { moderateScale } = initializeScalingUtils(Dimensions);

const Header = () => {
  return (
    <View style={styles.container}>
          <TouchableOpacity>
            <SvgComponent svgKey="LogoSVG" width={moderateScale(60)} height={moderateScale(60)} fill={'#ffffff'} />
          </TouchableOpacity>

        <View style={styles.iconsContainer}>
        <TouchableOpacity>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>11</Text>
        </View>
            <SvgComponent svgKey="ChatSVG" width={moderateScale(22)} height={moderateScale(22)} fill={'#ffffff'} />
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
  iconsContainer:{
    flexDirection:"row",
  },
  unreadBadge:{
    backgroundColor:"tomato",
    position:"absolute",
    left:12,
    bottom:16,
    width:20,
    height:15,
    borderRadius:25,
    alignItems:"center",
    justifyContent:"center",
    zIndex:9999,
  },
  unreadBadgeText:{
    color:"#fff",
    fontWeight:"600",
  },  
});
export default Header