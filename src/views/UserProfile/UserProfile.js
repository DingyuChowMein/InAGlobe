import React, { Component } from 'react'
import ScrollMenu from "react-horizontal-scrolling-menu"

import { 
    withStyles, 
    Avatar, 
    Grid,
    Hidden,
    Link, 
    Typography,
    IconButton,
} from "@material-ui/core"
import { 
    ArrowBackIos, 
    ArrowForwardIos, 
    Create, 
    LocationOn 
} from "@material-ui/icons"

import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import styles from "../../assets/jss/views/userProfileStyle"

import exampleProfile from "../../assets/data/UserProfileData"
import { userService } from "../../services/userService"
import pick from "lodash.pick"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            data: {
                userId: "",
                firstName: "",
                lastName: "",
                permissions: null, 
                profilePicture: "", 
                email: "", 
                location: "", 
                shortDescription: "", 
                longDescription: "", 
                pictures: null,
                documents: null
            }
        }
        this.pictureList = null
    }

    updateDimensions = () => {
        this.setState({ 
            width: window.innerWidth
        })
    }

    get = (id) => {
        userService.getProfile(id)
            .then(data => {
                console.log(data)
                return data
            })
            .catch(console.log)
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        if (this.pictureList) this.pcitureList.scrollTo(0)
        const currentUser = pick(JSON.parse(localStorage.getItem("user"), ["userId", "firstName", "lastName", "permissions", "profilePicture", "email", "location", "shortDescription", "longDescription", "pictures", "documents"]))
        this.setState({
            data: this.props.match.params.id ? this.get(this.props.match.params.id) : currentUser
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    render() {
        const { classes } = this.props
        const {
            firstName, 
            lastName, 
            permissions, 
            profilePicture, 
            email, 
            location, 
            shortDescription, 
            longDescription, 
            pictures,
            documents 
        } = this.state.data

        let userTypeText
        switch (permissions) {
            case 0:
                userTypeText = "Admin"
                break
            case 1:
                userTypeText = "Humanitarian"
                break
            case 2:
                userTypeText = "Academic"
                break
            case 3:
                userTypeText = "Student"
                break
            default:
                console.log("Big User Type Error!!!!")
        }

        var scrollMenu = null
        if (pictures) {
            scrollMenu = (
                <ScrollMenu 
                    ref={element => this.pictureList = element}
                    data={pictures.map((pic, index) => (
                            <img
                                key={index}
                                alt={`Album Data ${index}`}
                                src={pic}
                                className={classes.scrollViewImage}
                            />
                    ))}
                    arrowLeft={
                        <IconButton aria-label="scroll-left">
                            <ArrowBackIos fontSize="small"/>
                        </IconButton>
                    }
                    arrowRight={
                        <IconButton aria-label="scroll-right">
                            <ArrowForwardIos fontSize="small"/>
                        </IconButton>
                    }
                    hideArrows={true}
                    hideSingleArrow={true}
                    alignOnResize={true}
                    scrollToSelected={true}
                    transition={0.6}
                    innerWrapperStyle={{
                        marginTop: "0", 
                        marginBottom: "10px"
                    }}
                />
            )
        }
        

        return (
            <ResponsiveDrawer name={"User Profile"}>
                <Grid container>
                    {this.props.match.params.id
                        ? 
                        null
                        :
                        <Grid item xs={12} className={classes.rightAlign}>
                            <IconButton
                                onClick={() => this.props.history.push("/main/editprofile")}
                            >
                                <Create fontSize="medium" />
                            </IconButton>
                            <Typography component="h5" variant="h5" className={classes.editProfile}>
                                {":Edit Profile"}
                            </Typography>
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.centering}>
                        <Avatar 
                            alt="Profile Picture"
                            src={profilePicture}
                            className={classes.avatar}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.centering}>
                        <Typography component="h3" variant="h2">
                            {`${firstName} ${lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>Email Address: </b>
                            {email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>User Type: </b>
                            {userTypeText}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <Typography component="h5" variant="h5">
                            <b>Location: </b>
                            {location}
                        </Typography>
                        <Link 
                            href={`https://www.google.com/maps/search/${location ? location.replace(" ", "+") : ""}`}
                            className={classes.mapsLinkIcon}
                        >
                            <LocationOn />
                        </Link>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Summary: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {shortDescription}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Biography: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {longDescription}
                            </Typography>
                        </div>
                    </Grid>
                    {pictures 
                        ? 
                        <Grid item xs={12} className={classes.leftAlign}>
                            <div>
                                <Typography component="h5" variant="h5">
                                    <b>Album Pictures: </b>
                                </Typography>
                                <br />
                                <Hidden xsDown implementation="css">
                                    <div style={{ width: `calc(${this.state.width}px - 350px)` }}>
                                        {scrollMenu}
                                    </div>
                                </Hidden>
                                <Hidden smUp implementation="css">
                                    <div style={{ width: `calc(${this.state.width}px - 85px)` }}>
                                        {scrollMenu}
                                    </div>
                                </Hidden>
                            </div>
                        </Grid>
                        :
                        null
                    }
                </Grid>
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(Profile)