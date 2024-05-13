import { Dimensions } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton';
import { FlatList } from 'react-native';
import { View } from 'moti';
import { colorPalette } from '../../Config/Theme';

const LoadingPlaceHolder = ({ condition, theme }) => {

    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark':'light' , // if the primary color is dark then the skeleton will be dark
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
    }

    const screenWidth = Dimensions.get('window').width;
    const columnCount = 3;
    const gapSize = 1;

    const skeletonWidth = (screenWidth - (columnCount + 1) * gapSize) / columnCount;

    const skeletonArray = new Array(20).fill();

    const renderItem = ({ item }) => (
        <View
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