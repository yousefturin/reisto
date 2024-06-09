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
  