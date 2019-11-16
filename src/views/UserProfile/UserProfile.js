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

import styles from "../../assets/jss/views/profileStyle"

import exampleProfile from "../../assets/data/UserProfileData"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            // data: {
            //     userId: props.match.params.id,
            //     firstName: "",
            //     lastName: "",
            //     userType: "", 
            //     profilePic: "", 
            //     email: "", 
            //     location: "", 
            //     shortDescription: "", 
            //     longDescription: "", 
            //     album: []
            // }
        }
        this.albumList = null
    }

    updateDimensions = () => {
        this.setState({ 
            width: window.innerWidth
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        if (this.list) this.list.scrollTo(0)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    render() {
        const { classes } = this.props
        const { userid, firstname, lastname, permissions, profile_picture, email, location, short_description, long_description, album } = JSON.parse(localStorage.getItem("user"))

        console.log(JSON.parse(localStorage.getItem("user")))

        if (userid) {
            console.log(userid)
            console.log("It exists!")
        }

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
        if (album) {
            scrollMenu = (
                <ScrollMenu 
                    ref={element => this.albumList = element}
                    data={album.map((pic, index) => (
                            <img
                                key={index}
                                alt={`Album Data ${index}`}
                                src={pic}
                                style={{ width: "300px", height: "200px", marginRight: "20px" }}
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
                    {userid
                        ? 
                        null
                        :
                        <Grid item xs={12} className={classes.rightAlign}>
                            <IconButton
                                onClick={() => this.props.history.push("/main/editprofile")}
                            >
                                <Create fontSize="medium" />
                            </IconButton>
                            <Typography component="h5" variant="h5" style={{ color: "grey", marginRight: "20px" }}>
                                {":Edit Profile"}
                            </Typography>
                        </Grid>
                    }
                    <Grid item xs={12} className={classes.centering}>
                        <Avatar 
                            alt="Profile Picture"
                            src={profile_picture}
                            style={{ height: "250px", width: "250px" }}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.centering}>
                        <Typography component="h3" variant="h2">
                            {`${firstname} ${lastname}`}
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
                            href={`https://www.google.com/maps/search/${exampleProfile.location.replace(" ", "+")}`}
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
                                {short_description}
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
                                {long_description}
                            </Typography>
                        </div>
                    </Grid>
                    {album 
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