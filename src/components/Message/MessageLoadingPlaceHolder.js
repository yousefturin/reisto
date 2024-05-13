import { View } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton'
import { colorPalette } from '../../Config/Theme'

const MessageLoadingPlaceHolder = ({ theme }) => {
    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark':'light' , // if the primary color is dark then the skeleton will be dark
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
    }
    const skeletonArray = new Array(10).fill();

    return (
        <>
            {skeletonArray.map((item, index) => (
                <View style={{ flexDirection: "row", marginHorizontal: 10 }} key={index}>
                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", marginVertical: 7 }}>
                        <Skeleton
                            show
                            height={60}
                            width={60}
                            radius={'round'}
                            {...SkeletonCommonProps} />
                    </View>
                    <View style={{ flexDirection: "row", width: "80%", justifyContent: "flex-start", alignItems: "center", gap: 5 }}>
                        <View style={{ width: "80%", gap: 5 }}>
                            <Skeleton
                                show
                                height={15}
                                width={200}
                                {...SkeletonCommonProps}
                            />
                            <Skeleton
                                show
                                height={15}
                                width={120}
                                {...SkeletonCommonProps}
                            />
                        </View>
                        <Skeleton
                            show
                            height={15}
                            width={40}
                            {...SkeletonCommonProps}
                        />
                    </View>
                </View>
            ))
            }
        </>
    )
}

export default MessageLoadingPlaceHolder