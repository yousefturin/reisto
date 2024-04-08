import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native'
import React, { useState } from 'react'
import SvgComponent from "../../utils/SvgComponents";
import initializeScalingUtils from "../../utils/NormalizeSize"
import { Divider } from 'react-native-elements';
import calculateTimeDifference from '../../utils/TimeDifferenceCalculater';
import { LinearGradient } from 'expo-linear-gradient';


const { moderateScale } = initializeScalingUtils(Dimensions);
const Icons = [
    {
        name: 'LikeSVG'
    },
    {
        name: 'CommentSVG'
    },
    {
        name: 'ShareSVG'
    },
    {
        name: 'BookmarkSVG'
    },
]
//#region Post
const Post = ({ post, userData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isContainerVisible, setContainerVisible] = useState(false);
    // const [isNameListVisible, setIsNameListVisible] = useState(false);

    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };
    const toggleContainer = () => {
        setContainerVisible(!isContainerVisible);
    };

    return (
        <View style={{ marginBottom: 30 }}>
            {/* <Divider width={1} orientation='horizontal' color="#222222" /> */}
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 10, }}>
                <PostFooter toggleContainer={toggleContainer} />
                <Likes post={post} />
                <CategoryAndTime post={post} />
                <Caption post={post} isExpanded={isExpanded} toggleCaption={toggleCaption} />
                {!!post.comments.length?
                    <TouchableOpacity onPress={toggleContainer}>
                        <CommentSection post={post} />
                    </TouchableOpacity>:null
                }

                <Comments post={post} setContainerVisible={setContainerVisible} isContainerVisible={isContainerVisible} userData={userData} />
                <TimeStamp post={post} />
            </View>
        </View>
    )
}
//#endregion

const TimeStamp = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        <Text style={{ color: "#8E8E93" }}>
            {calculateTimeDifference(post.createdAt)} ago
            {/* {console.log(post.createdAt)} */}
        </Text>
    </View>
)


//#region Post Header
const PostHeader = ({ post }) => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            alignItems: "center",
        }}>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: post.profile_picture }} style={styles.userImage} />
                <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>{post.user}</Text>
            </View>
            <TouchableOpacity>
                <Text style={{ color: "#fff", fontWeight: "900", marginBottom: 15, marginRight: 10 }}>...</Text>
            </TouchableOpacity>
        </View>
    )
}
//#endregion

//#region Post Image
const PostImage = ({ post }) => (
    <View style={{ width: "100%", height: 450 }}>
        <Image source={{ uri: post.imageURL }} style={{ height: "100%", resizeMode: "cover" }} />
    </View>
)
//#endregion

//#region Post Footer
const PostFooter = ({ toggleContainer }) => (
    <View style={{ flexDirection: "row" }}>
        <View style={styles.leftFooterIconsContainer}>
            <TouchableOpacity>
                <Icon svgKey={Icons[0].name} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleContainer}>
                <Icon svgKey={Icons[1].name} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon svgKey={Icons[2].name} />
            </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity>
                <Icon svgKey={Icons[3].name} />
            </TouchableOpacity>
        </View>
    </View>
)
//#endregion

//#region Icon Buttons
const Icon = ({ svgKey }) => (
    <SvgComponent svgKey={svgKey} width={moderateScale(24)} height={moderateScale(24)} fill={'#ffffff'} />
)
//#endregion

//#region Likes Display
const Likes = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 4, }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{post.likes.toLocaleString('en')} Likes</Text>
    </View>
)
//#endregion

//#region Category and Time Display
const CategoryAndTime = ({ post }) => (
    <View style={{ flexDirection: "row", marginTop: 5, gap: 10 }}>
        <LinearGradient
            colors={['#7e9bdf', '#6581B7', '#445379']}
            style={{ width: "20%", padding: 5, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{post.category}</Text>
        </LinearGradient>
        <View style={{ height: "100%", width: 1, borderRadius: 50, backgroundColor: "#fff" }}></View>
        <View style={{ width: "20%", padding: 5, justifyContent: "center", alignItems: "flex-start" }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{post.timeOfMake} min</Text>
        </View>
    </View>
)
//#endregion

//#region Caption Display
const Caption = ({ post, isExpanded, toggleCaption }) => (
    <>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text style={{ color: "#fff" }} onPress={toggleCaption}>
                <Text style={{ fontWeight: "700" }}>{post.user} </Text>
                {isExpanded ? post.caption : post.caption.slice(0, 100) + '... '}
                <Text style={{ color: "#8E8E93" }}>
                    {isExpanded ? '' : 'more'}
                </Text>
            </Text>
        </View>
        {isExpanded ? <CaptionIngredient post={post} /> : null}
        {isExpanded ? <CaptionInstruction post={post} /> : null}
    </>

)
//#endregion

//#region Caption Ingredient
const CaptionIngredient = ({ post }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff", marginBottom: 5, marginTop: 10 }}>Ingredients</Text>
        <Text style={{ color: "#fff" }}>
            {(
                post.captionIngredients.map((ingredient, index) => (
                    <Text key={index}>
                        {index + 1}. {ingredient}
                        {"\n"}
                    </Text>
                ))
            )}
        </Text>
    </>
)
//#endregion

//#region Caption Instruction
const CaptionInstruction = ({ post }) => (
    <>
        <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff", marginBottom: 5, marginTop: 0 }}>Instructions</Text>
        <Text style={{ color: "#fff" }}>
            {(
                post.captionInstructions.map((instruction, index) => (
                    <Text key={index}>
                        {index + 1}. {instruction}
                        {"\n"}
                    </Text>
                ))
            )}
        </Text>
    </>
)
//#endregion

//#region Comment Display
const CommentSection = ({ post }) => (
    <View style={{ marginTop: 5 }}>
        {/* If the is no !! tha application will crash over the .length function since it will return a 0 value if it
    does not have any comments and by that the React will not render teh 0 value because it is not wrapped 
    in text component, and to return teh value of true or false from that line condition it must use the "!!" */}
        {!!post.comments.length && (
            <Text style={{ color: "#8E8E93" }}>
                View{post.comments.length > 1 ? ' all' : ''} {post.comments.length}{' '}
                {post.comments.length > 1 ? 'comments' : 'comment'}
            </Text>
        )}
    </View>
)
const Comments = ({ post, isContainerVisible, setContainerVisible, userData }) => (
    <Modal
        visible={isContainerVisible}
        animationType="slide"
        transparent={false}
        presentationStyle="pageSheet"
        statusBarTranslucent={false}
        onRequestClose={() => {
            setContainerVisible(!isContainerVisible);
        }}
    >
        <View style={{ backgroundColor: "#262626", flex: 1 }}>
            <CommentsHeader />
            <CommentsContent post={post} />
            <CommentFooter userData={userData} post={post} />
        </View>
    </Modal>
)

const CommentsContent = ({ post }) => (
    <ScrollView style={styles.commentsContainer}>
        {post.comments.map((comment, index) => (
            <View key={index} style={{ marginVertical: 15, }} >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", }}>
                        <Image source={{ uri: comment.profilePicture }} style={styles.userImage} />

                        <View style={{ flexDirection: "column", width: "80%", flexGrow: 1 }}>
                            <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>{comment.user}</Text>
                            <Text style={{ color: "#ffffff", marginLeft: 6, }}>
                                {comment.comment}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={{ color: "#979797", marginRight: 6, }}> {calculateTimeDifference(comment.timeStamp)}</Text>
                    </View>
                </View>
            </View>
        ))}
    </ScrollView>
)

const CommentsHeader = ({ }) => (
    <>
        <View style={styles.ModalTopNotch} />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20, alignSelf: "center", padding: 20, marginTop: 5 }}>Comments</Text>
        <Divider width={1} orientation='horizontal' color="#2b2b2b" />
    </>
)


const CommentFooter = ({ userData, post }) => {
    const [keyboardPadding, setKeyboardPadding] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [btnStat, setBtnStat] = useState(false)

    const handleKeyboardDidShow = () => {
        setKeyboardPadding(20); // Add some extra padding when keyboard appears
    };

    const handleKeyboardDidHide = () => {
        setKeyboardPadding(0); // Reset padding when keyboard disappears
    };
    const handleDisableBtn = (value) => {
        if (value.length < 2) {
            setBtnStat(true); // Disable the button when the comment text is less than 2 characters
        } else {
            setBtnStat(false); // Enable the button when the comment text is 2 or more characters
        }
        setCommentText(value);
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Divider width={1} orientation='horizontal' color="#2b2b2b" />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingBottom: keyboardPadding }}>

                <Image source={{ uri: userData.profile_picture }} style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                    margin: 20,
                    marginBottom: 50,
                    borderWidth: 1,
                    borderColor: "#2b2b2b"
                }} />

                <View style={styles.inputControl}>
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={true}
                        spellCheck={true}
                        style={[{
                            flexGrow: 1, flexShrink: 1, color: "#ffffff", paddingHorizontal: 16,
                            paddingTop: Platform.OS === 'ios' ? 15 : 0,
                            paddingBottom: 15,
                        }]}
                        placeholder={`Add a Comment for ${post.user}...`}
                        placeholderTextColor={"#2b2b2b"}
                        value={commentText}
                        textContentType='none'
                        multiline={true}
                        keyboardType='default'
                        onFocus={handleKeyboardDidShow}
                        onBlur={handleKeyboardDidHide}
                        onChangeText={value => handleDisableBtn(value)}
                    />

                    <TouchableOpacity disabled={commentText.length < 2} >
                        <LinearGradient
                            // Button Linear Gradient
                            colors={btnStat ? ['#bebebe', '#727272', '#4c4c4c'] : ['#7e9bdf', '#6581B7', '#445379']}
                            style={{ marginRight: 10, padding: 5, borderRadius: 11, justifyContent: "center", alignItems: "center" }}>
                            <SvgComponent svgKey="SubmitCommentSVG" width={moderateScale(18)} height={moderateScale(18)} fill={'#ffffff'} />
                        </LinearGradient>

                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}




const styles = StyleSheet.create({
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 50,
        marginLeft: 6,
        borderWidth: 1,
        borderColor: "#2b2b2b"
    },
    leftFooterIconsContainer: {
        flexDirection: "row",
        width: "30%",
        justifyContent: "space-between",
    },
    commentsContainer: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 20,
        // justifyContent: "flex-start",
        // alignItems: "flex-start",
    },
    ModalTopNotch: {
        height: 5,
        width: 40,
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        marginTop: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        backgroundColor: "#2b2b2b",
        alignSelf: "center"
    },
    inputControl: {
        borderColor: "#2b2b2b",
        borderWidth: 1,

        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        marginTop: 20,
        marginRight: 20,
        marginBottom: 50,
        flex: 1, // Ensure the TextInput expands to fill its container
    },
});
export default Post