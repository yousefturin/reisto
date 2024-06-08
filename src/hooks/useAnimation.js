/*
 * Copyright (c) 2024 Yusef Rayyan
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/
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