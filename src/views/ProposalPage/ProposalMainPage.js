// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"

class ProposalMainPage extends Component {
    render() {
        return (
            <ResponsiveDrawer name={"Proposal Page"}>
                <h1>Hello, World!</h1>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)