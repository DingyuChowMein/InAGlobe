import React, { Component } from 'react'

import { withStyles } from "@material-ui/core"

import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import styles from "../../assets/jss/views/profileStyle"

class Profile extends Component {

    render() {
        return (
            <ResponsiveDrawer name={"User Profile"}>
                <h5>Hello World!</h5>
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(Profile)