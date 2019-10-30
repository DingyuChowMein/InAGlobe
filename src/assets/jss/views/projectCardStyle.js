const styles = {
    cardImgTop: {
        width: "100%",
        height: "180px",
        borderTopLeftRadius: "calc(.25rem - 1px)",
        borderTopRightRadius: "calc(.25rem - 1px)",
        display: "block", 
        objectFit: "cover"
    },
    cardImgBottom: {
        width: "100%",
        borderBottomRightRadius: "calc(.25rem - 1px)",
        borderBottomLeftRadius: "calc(.25rem - 1px)"
    },
    cardImgOverlay: {
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        padding: "1.25rem"
    },
    cardImg: {
        width: "100%",
        borderRadius: "calc(.25rem - 1px)"
    },
    learnMoreButton: {
        width: "auto",
        marginRight: "10px",
        minWidth: "40%"
    },
    selectProposalButton: {
        width: "auto",
        minWidth: "40%"
    },
    buttonDiv: { 
        textAlign: "center" 
    }
}

export default styles