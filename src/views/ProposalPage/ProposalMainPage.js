// Main ReactJS libraries
import React, { Component } from 'react'
import { withRouter } from "react-router-dom"

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ProposalPage from "./ProposalPage"

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"

class ProposalMainPage extends Component {

    componentDidMount() {
        console.log("Hello there!")
        // console.log(this.props.location.state.data)
    }

    render() {
        console.log("Print something!")
        return (
            <h1>Hello World!</h1>
        )
        // return (
        //     <ProposalPage {...this.props} data={this.props.location.state.data} />
        // )
    }
}

export default withRouter(withStyles(styles)(ProposalMainPage))