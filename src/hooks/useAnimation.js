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




import { useEffect } from 'react'
import { Animated } from 'react-native';

const useAnimation = (fromWhere = null, animationParam) => {
    const scrollY = new Animated.Value(0);
    const offsetAnimation = new Animated.Value(0);

    if (fromWhere === "ScreensWithSearchBar") {
        const clampedScroll = Animated.diffClamp(
            Animated.add(
                scrollY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: 'clamp',
                }),
                offsetAnimation,
            ),
            0,
            65,
        );
        const clampedScrollSecond = Animated.diffClamp(
            Animated.add(
                scrollY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateLeft: 'clamp',
                }),
                offsetAnimation,
            ),
            0,
            animationParam,
        );
        var _clampedScrollValue = 0;
        var _offsetValue = 0;
        var _scrollValue = 0;
        useEffect(() => {
            scrollY.addListener(({ value }) => {
                const diff = value - _scrollValue;
                _scrollValue = value;
                _clampedScrollValue = Math.min(
                    Math.max(_clampedScrollValue + diff, 0),
                    65,
                );
            })
            offsetAnimation.addListener(({ value }) => {
                _offsetValue = value;
            });
        }, [])
        const headerTranslate = clampedScroll.interpolate({
            inputRange: [0, 65],
            outputRange: [0, -65],
            extrapolate: 'clamp',
        });
        const searchBarTranslate = clampedScrollSecond.interpolate({
            inputRange: [0, animationParam],
            outputRange: [0, -animationParam],
            extrapolate: 'clamp',
        });

        const opacity = clampedScroll.interpolate({
            inputRange: [0, 40, 65],
            outputRange: [1, 0.3, 0],
            extrapolate: 'clamp',
        });
        const opacitySearchBar = clampedScroll.interpolate({
            inputRange: [0, 40, 80],
            outputRange: [1, 0.6, 0],
            extrapolate: 'clamp',
        });
        var scrollEndTimer = null
        const onMomentumScrollBegin = () => {
            clearTimeout(scrollEndTimer)
        }
        const onMomentumScrollEnd = () => {
            const toValue = _scrollValue > 65 && _clampedScrollValue > 65 / 2 ? _offsetValue + 65 : _offsetValue - 60;
            Animated.timing(offsetAnimation, {
                toValue,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }

        const onScrollEndDrag = () => {
            scrollEndTimer = setTimeout(onMomentumScrollEnd, 250)
        }
        return { headerTranslate, searchBarTranslate, opacity, opacitySearchBar, scrollY, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag }
    }
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnimation,
        ),
        0,
        animationParam,
    );
    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;

    useEffect(() => {
        scrollY.addListener(({ value }) => {
            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff, 0),
                animationParam,
            );
        })
        offsetAnimation.addListener(({ value }) => {
            _offsetValue = value;
        });
    }, [])

    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, animationParam],
        outputRange: [0, -animationParam],
        extrapolate: 'clamp',
    });
    const opacity = clampedScroll.interpolate({
        inputRange: [0, 40, animationParam],
        outputRange: [1, 0.1, 0],
        extrapolate: 'clamp',
    });

    var scrollEndTimer = null
    const onMomentumScrollBegin = () => {
        clearTimeout(scrollEndTimer)
    }
    const onMomentumScrollEnd = () => {
        const toValue = _scrollValue > animationParam && _clampedScrollValue > animationParam / 2 ? _offsetValue + animationParam : _offsetValue - animationParam;
        Animated.timing(offsetAnimation, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd, 250)
    }
    return { headerTranslate, opacity, scrollY, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag }
}

export default useAnimation