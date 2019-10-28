const drawerWidth = 260

const styles = theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		marginLeft: drawerWidth,
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
    logoImage: {
        width: "40px",
        display: "inline-block",
        marginLeft: "10px",
        marginRight: "15px",
        verticalAlign: "middle"
    },
    logoText: {
        display: "inline-block",
        marginLeft: "15px",
        marginRight: "15px",
        verticalAlign: "middle"
    },
    logoTextFont: {
        fontSize: "1.35em"
    },
    img: {
        width: "40px",
        top: "12px",
        position: "absolute",
        verticalAlign: "middle",
        border: "0"
    }
})

export default styles