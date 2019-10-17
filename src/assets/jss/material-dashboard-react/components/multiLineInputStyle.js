import {
    primaryColor,
    dangerColor,
    successColor,
    grayColor,
    defaultFont
} from "../../material-dashboard-react.js"

const multiLineInputStyle = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: "100%",
        ...defaultFont,
        color: grayColor[3] + " !important",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "1.42857",
        letterSpacing: "unset"
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: "100%",
    },
}

export default multiLineInputStyle;