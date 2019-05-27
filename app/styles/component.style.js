import {
    StyleSheet
} from 'react-native';
import theme from '../styles/theme.style';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLOR_LIGHTGREY,
    },
    scrollView: {
        flexGrow: 1,
        flex: 1,
        backgroundColor: theme.COLOR_LIGHTGREY,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute'
    },
    textLargest: {
        color: theme.FONT_PRIMARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_LARGEST,
        textAlign: 'left',
    },
    textExtraLarge: {
        color: theme.FONT_PRIMARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_EXTRA,
        textAlign: 'left',
    },
    textHeader: {
        color: theme.FONT_PRIMARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_HEADER,
        textAlign: 'left',
    },
    textNormal: {
        color: theme.FONT_PRIMARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_LARGE,
        textAlign: 'left',
    },
    textNormalGreen: {
        color: theme.PRIMARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_LARGE,
        textAlign: 'left',
    },
    textSmall: {
        color: theme.FONT_SECONDARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_MEDIUM,
        textAlign: 'left',
    },
    textTiny: {
        color: theme.FONT_SECONDARY_COLOR,
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_SMALL,
        textAlign: 'left',
    },
    postContainer: {
        alignItems: "stretch",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%"
    },
    postStep: {
        alignItems: "center",
        backgroundColor:
        theme.BACKGROUND_SECONDARY_COLOR,
        paddingBottom: 5,
        paddingTop: 5,
        width: "100%"
    },
    postPhotoContainer: {
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        flexWrap: "wrap",
        alignItems: "stretch"
    },
    confirmPhotoContainer: {
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
        flexWrap: "wrap",
        alignItems: "stretch",
        justifyContent: "center",
    },
    postAddPhotoButton: {
        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR,
        borderRadius: 10,
        width: 75,
        height: 75,
        marginRight: 5,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    thumbnailPhoto: {
        borderRadius: 10,
        width: 75,
        height: 75,
        marginRight: 5,
        marginBottom: 5
    },
    itemRowPost: {
        flexDirection: "row",
        backgroundColor: theme.COLOR_WHITE,
        paddingTop: 10,
        paddingBottom: 10,
        width: "100%"
    }, 
    categoryNormalBox: {
        backgroundColor: theme.COLOR_WHITE,
        borderColor: theme.PRIMARY_COLOR,
        borderWidth: 1,
        borderRadius: 6,
        marginRight: 10,
        marginBottom: 10,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
    },
    postCateContainer: {
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        flexWrap: "wrap",
        alignItems: "stretch"
    },
    tabbar: {
        backgroundColor: theme.COLOR_WHITE,
    },
    indicator: {
        backgroundColor: theme.PRIMARY_COLOR,
    },
    tabLabel: {
        fontFamily: theme.FONT_FAMILY,
        fontSize: theme.FONT_SIZE_MEDIUM,
        textAlign: 'center',
    },
    postList: {
        borderRadius: 10,
        width: "100%",
        alignItems: "stretch",
        borderWidth: 0,
        borderColor: theme.PRIMARY_COLOR,
        backgroundColor: theme.COLOR_WHITE,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom:15,
        shadowColor: theme.BACKGROUND_PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
    }
});