import React, { Component } from "react"

import { withStyles } from "@material-ui/core"

import styles from "../../assets/jss/components/notificationsStyle"

class Notifications extends Component {

    render() {
        return (
            <h1>Hello World</h1>
        )
    }
}

export default withStyles(styles)(Notifications)