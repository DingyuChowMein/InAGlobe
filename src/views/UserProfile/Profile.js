import React, { Component } from 'react'

import { 
    withStyles, 
    Avatar, 
    Grid, 
    GridList,
    Link, 
    Typography,
    IconButton,
} from "@material-ui/core"
import { LocationOn, ArrowBackIos, ArrowForwardIos } from "@material-ui/icons"

import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import styles from "../../assets/jss/views/profileStyle"

import exampleProfile from "../../assets/data/UserProfileData"
import PerfectScrollbar from 'perfect-scrollbar'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollValue: 0
        }
    }

    render() {
        const { classes } = this.props
        const { firstName, lastName, userType, profilePic, email, location, shortBio, longBio, album } = exampleProfile

        let userTypeText
        switch (userType) {
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

        return (
            <ResponsiveDrawer name={"User Profile"}>
                <Grid container>
                    <Grid item xs={12} className={classes.centering}>
                        <Avatar 
                            alt="Profile Picture"
                            src={profilePic}
                            style={{ height: "250px", width: "250px" }}
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
                            href={`https://www.google.com/maps/search/${exampleProfile.location.replace(" ", "+")}`}
                            className={classes.mapsLinkIcon}
                        >
                            <LocationOn />
                        </Link>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Short Biography: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {shortBio}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <div>
                            <Typography component="h5" variant="h5">
                                <b>Detailed Biography: </b>
                            </Typography>
                            <br />
                            <Typography component="span" variant="body1">
                                {longBio}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} className={classes.leftAlign}>
                        <IconButton
                            onClick={() => this.state.albumList.scrollTo(this)}
                        >
                            <ArrowBackIos fontSize="large"/>
                        </IconButton>
                        <PerfectScrollbar component="div">
                            <GridList
                                ref={albumList => this.setState({ albumList: albumList })}
                                cols={2.5}
                            >
                                {album.map((pic, index) => (
                                    <img src={pic} alt={index} />
                                ))}
                            </GridList>
                        </PerfectScrollbar>
                        <IconButton
                            onClick={() => this.setState({
                                scrollValue: this.state.scrollValue + 50
                            })}
                        >
                            <ArrowForwardIos fontSize="large"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(Profile)