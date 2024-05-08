import { View } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton'
import { colorPalette } from '../../Config/Theme'

const SkeletonCommonProps = {
    colorMode: 'dark',
    backgroundColor: colorPalette.dark.Secondary,
    transition: {
        type: 'timing',
        duration: 2000,
    }
}
const LoadingPlaceHolder = ({ fromWhere }) => {
    return (
        <>
            <LoaderPostHeader />
            <LoaderPostImage />
            <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                <LoaderPostFooter />
                <LoaderPostLikes />
                <LoaderPostCategoryAndTime />
                <LoaderPostCaption />
                <LoaderPostTimeStamp />
            </View>
            {/* // If the post is shared, the footer will not be displayed */}
            {fromWhere !== "sharedPost" &&
                <View style={{ marginTop: 15 }}>
                    <LoaderPostHeader />
                    <LoaderPostImage />
                </View>
            }
        </>
    )
}

const LoaderPostHeader = () => (

    <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        alignItems: "center",
    }}>

        <View style={{ flexDirection: "row", alignItems: "center" }}  >
            <Skeleton
                show
                height={35}
                width={35}
                radius={'round'}
                {...SkeletonCommonProps}
            />
            <View style={{ marginLeft: 6, borderRadius: 4, }}>
                <Skeleton
                    show
                    height={15}
                    width={120}
                    {...SkeletonCommonProps}
                />
            </View>
        </View>
        <View style={{ flexDirection: "row", gap: 5, marginBottom: 15, marginRight: 10, }}>
            <Skeleton
                show
                height={10}
                width={20}
                {...SkeletonCommonProps}
            />
        </View>
    </View>
)

const LoaderPostImage = () => (
    <Skeleton
        show
        height={450}
        radius={'square'}
        width={"100%"}
        {...SkeletonCommonProps}
    />

)

const LoaderPostFooter = () => (
    <View style={{ flexDirection: "row" }}>
        <View style={{
            flexDirection: "row",
            width: "30%",
            justifyContent: "space-between",
        }}>
            <Skeleton
                show
                height={30}
                width={30}
                {...SkeletonCommonProps}
            />
            <Skeleton
                show
                height={30}
                width={30}
                {...SkeletonCommonProps}
            />
            <Skeleton
                show
                height={30}
                width={30}
                {...SkeletonCommonProps}
            />
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Skeleton
                show
                height={30}
                width={30}
                {...SkeletonCommonProps}
            />
        </View>
    </View>
)

const LoaderPostLikes = () => (
    <View style={{ flexDirection: "row", marginTop: 15, }}>
        <Skeleton
            show
            height={20}
            width={200}
            {...SkeletonCommonProps}
        />
    </View>
)

const LoaderPostCategoryAndTime = () => (
    <View style={{ flexDirection: "row", marginTop: 15, gap: 10 }}>
        <View
            style={{ padding: 5, borderRadius: 6, justifyContent: "center", alignItems: "center" }}
        >
            <Skeleton
                show
                height={30}
                width={80}
                {...SkeletonCommonProps}
            />
        </View>
        <View style={{ height: "100%", width: 1, borderRadius: 50, backgroundColor: colorPalette.dark.Secondary, }} />
        <View style={{ width: "20%", padding: 5, justifyContent: "center", alignItems: "flex-start", }}>
            <Skeleton
                show
                height={30}
                width={80}
                {...SkeletonCommonProps}
            />
        </View>
    </View>
)

const LoaderPostCaption = () => (
    <View style={{ flexDirection: "column", marginTop: 15, gap: 10 }}>
        <Skeleton
            show
            height={15}
            width={350}
            {...SkeletonCommonProps}
        />
        <Skeleton
            show
            height={10}
            width={280}
            {...SkeletonCommonProps}
        />
    </View>
)

const LoaderPostTimeStamp = () => (
    <View style={{ marginTop: 10 }}>
        <Skeleton
            show
            height={10}
            width={80}
            {...SkeletonCommonProps}
        />
    </View>
)
export default LoadingPlaceHolder