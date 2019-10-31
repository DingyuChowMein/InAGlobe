// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ProposalPage from "./ProposalPage"
import RegularButton from '../../components/CustomButtons/RegularButton'

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"
import Comments from '../../components/Comments/Comments'
import commentsList from "../../assets/data/CommentData"

class ProposalMainPage extends Component {

    render() {
        const { classes, match } = this.props
        const proposalData = JSON.parse(localStorage.getItem(`proposalPage/${match.params.id}`))
        // const commentsList = [] // TODO: Enter the comments here
        return (
            <ProposalPage {...this.props} data={proposalData}>
                <div className={classes.buttonsDiv}>
                    <RegularButton color="primary">{proposalData.status}</RegularButton>
                </div>
                <div className={classes.commentsDiv}>
                    <Comments comments={commentsList}/>
                </div>
            </ProposalPage>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)