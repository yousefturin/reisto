
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



import { View } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton'

const MessageLoadingPlaceHolder = ({ theme }) => {
    const SkeletonCommonProps = {
        colorMode: theme.Primary === '#050505' ? 'dark' : 'light', // if the primary color is dark then the skeleton will be dark
        backgroundColor: theme.Secondary,
        transition: {
            type: 'timing',
            duration: 2000,
        }
    }
    const skeletonArray = new Array(10).fill();

    return (
        <View style={{ paddingTop: 100, }}>
            {skeletonArray.map((item, index) => (
                <View style={{ flexDirection: "row", marginHorizontal: 10, }} key={index}>
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
        </View>
    )
}

export default MessageLoadingPlaceHolder