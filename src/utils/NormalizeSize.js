/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
 */



/**
 * Function to initialize scaling utilities based on device dimensions.
 * @param {Object} Dimensions - The Dimensions object from react-native.
 * @returns {Object} An object containing scaling functions.
 */
function initializeScalingUtils(Dimensions) {
    const { width, height } = Dimensions.get('window');
  
    // Guideline sizes are based on standard ~5" screen mobile device
    const guidelineBaseWidth = 350;
    const guidelineBaseHeight = 680;
  
    /**
     * Scale a given size based on the device's width.
     * @param {number} size - The size to be scaled.
     * @returns {number} The scaled size.
     */
    const scale = size => width / guidelineBaseWidth * size;
  
    /**
     * Scale a given size based on the device's height.
     * @param {number} size - The size to be scaled.
     * @returns {number} The scaled size.
     */
    const verticalScale = size => height / guidelineBaseHeight * size;
  
    /**
     * Scale a given size based on the device's width with moderation.
     * @param {number} size - The size to be scaled.
     * @param {number} [factor=0.5] - The moderation factor.
     * @returns {number} The scaled size.
     */
    const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
  
    return { scale, verticalScale, moderateScale };
  }
  
  export default initializeScalingUtils;
  