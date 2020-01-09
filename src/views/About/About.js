import React, { Component } from "react"

import { withStyles } from "@material-ui/core"

import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer"

import styles from "../../assets/jss/views/aboutStyle"

class About extends Component {

    render() {
        return (
            <ResponsiveDrawer name="About">

            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(About)