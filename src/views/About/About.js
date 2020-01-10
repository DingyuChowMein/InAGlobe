import React, { Component } from "react"

import { withStyles, Avatar, Grid, Typography } from "@material-ui/core"

import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer"

import styles from "../../assets/jss/views/aboutStyle"
import logo from "../../assets/img/logo.png"

class About extends Component {

    render() {
        const { classes } = this.props
        return (
            <ResponsiveDrawer name="About">
                <Grid container>
                    <Grid item xs={3} sm={3} md={3}>
                        <Avatar
                            alt="Profile Picture"
                            src={logo}
                            className={classes.logo}
                        />
                    </Grid>
                    <Grid item xs={9} sm={9} md={9}>
                        <Typography component="h3" variant="h2">
                            <b> InAGlobe Education </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        
                    </Grid>
                </Grid>
                
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(About)