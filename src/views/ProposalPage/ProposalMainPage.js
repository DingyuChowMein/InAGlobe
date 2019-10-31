// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ProposalPage from "./ProposalPage"

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"
import RegularButton from '../../components/CustomButtons/RegularButton'

class ProposalMainPage extends Component {

    render() {
        const { match } = this.props
        const proposalData = JSON.parse(localStorage.getItem(`proposalPage/${match.params.id}`))
        return (
            <ProposalPage {...this.props} data={proposalData}>
                <RegularButton>
                    {proposalData.status}
                </RegularButton>
            </ProposalPage>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)