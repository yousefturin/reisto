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




import { Dimensions } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton';
import { FlatList } from 'react-native';
import { View } from 'moti';

const LoadingPlaceHolder = ({ condition, theme }) => {
    const screenWidth = Dimensions.get('window').width;
    const columnCount = 3;
    const gapSize = 1;
    const skeletonWidth = (screenWidth - (columnCount + 1) * gapSize) / columnCount;
    const skeletonArray = [1,3,23,4,24,23,54,23,5,25,2,35,23,52,52,5,2,5,23,5223424,23424,12,34]

    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark' : 'light', // if the primary color is dark then the skeleton will be dark
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
        }
    }

    const renderItem = () => (
        <View
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                width: skeletonWidth,
                height: skeletonWidth,
                margin: gapSize,
            }}>
            <Skeleton
                show={condition}
                height={"100%"}
                width={"100%"}
                radius={'square'}
                {...SkeletonCommonProps}
            />
        </View>
    );

    const keyExtractor = (item, index) => {
        if (item !== undefined && item !== null) {
            return item.toString();
        }
        return index.toString();
    };
    
    return (
        <FlatList
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={'always'}
            data={skeletonArray}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={keyExtractor}
            numColumns={columnCount}
            contentContainerStyle={{
                flexDirection: 'column',
                paddingHorizontal: gapSize,
                paddingVertical: gapSize,
                gap: 1
            }}
        />
    );
}

export default LoadingPlaceHolder