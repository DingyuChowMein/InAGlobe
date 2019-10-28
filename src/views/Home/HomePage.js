// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/styles'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing class's stylesheet
import styles from "../../assets/jss/views/homePageStyle"

class HomePage extends Component {
    render() {
        return (
            <ResponsiveDrawer name={"Dashboard"}>
                <h1>Hello, World!</h1>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(HomePage)