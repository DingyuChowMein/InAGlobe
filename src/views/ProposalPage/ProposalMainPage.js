// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import AddCheckpointModal from "../AddCheckpoint/AddCheckpoint"
import Comments from '../../components/Comments/Comments'
import ProposalPage from "./ProposalPage"
import RegularButton from '../../components/CustomButtons/RegularButton'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"

import config from "../../config"
import { commentsService } from "../../services/commentsService"

class ProposalMainPage extends Component {

    constructor(props) {
        super(props)
        const userType = JSON.parse(localStorage.getItem('user')).permissions
        const projectData = JSON.parse(localStorage.getItem(`proposalPage/${this.props.match.params.id}`))
        console.log(projectData)
        this.state = {
            userType: userType,
            projectData: projectData,
            buttonDisabled: !(userType === 0 || (userType !== 1 && projectData.status === "Approved" && projectData.joined === 0)),
            buttonMessage: this.getButtonMessage(userType, projectData.status, projectData.joined),
            comments: [],
            showModal: false,
        }

        console.log("UserType:" + this.state.userType)
        console.log(this.state.buttonDisabled)
    }

    actionButtonClicked = () => {
        const token = JSON.parse(localStorage.getItem('user')).token
        const bearer = 'Bearer ' + token
        let new_project_data
        if (this.state.userType === 0) {
            new_project_data = this.state.projectData
            new_project_data.status = new_project_data.status === "Approved" ? "Needs Approval" : "Approved"
            this.setState({
                projectData: new_project_data,
                buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status, new_project_data.joined)
            })
            fetch(config.apiUrl + '/approve/', {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"projectId": this.state.projectData.id}),
            }).then((response) => {
                // Redirect here based on response
                console.log(response)
            }).catch((err) => {
                console.log(err)
            })
        } else if ((this.state.userType === 2 || this.state.userType === 3) && (this.state.projectData.joined === 0)) {
            new_project_data = this.state.projectData
            new_project_data.joined = 1
            this.setState({
                projectData: new_project_data,
                buttonDisabled: true,
                buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status, new_project_data.joined)
            })

            fetch(config.apiUrl + '/dashboard/', {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"projectId": this.state.projectData.id}),
            }).then((response) => {
                // Redirect here based on response
                console.log(response)
            })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    getButtonMessage = (userType, status, joined) => {
        if (userType === 0) {
            if (status === "Needs Approval") {
                return "Approve"
            }
            return "Disapprove"
        } else if (userType === 1) {
            return status
        } else if (joined === 0) {
            return "Request joining"
        } else if (joined === 1) {
            return "Awaiting approval"
        } else {
            return "Joined"
        }
    }


    render() {
        const {classes, match} = this.props
        const proposalData = JSON.parse(localStorage.getItem(`proposalPage/${match.params.id}`))
        return (
            <ResponsiveDrawer name={"Project Page"}>
                <ProposalPage {...this.props} data={proposalData} isPreview={false}>
                    <div className={classes.buttonsDiv}>
                        <RegularButton
                            color="primary"
                            onClick={this.actionButtonClicked}
                            disabled={this.state.buttonDisabled}
                        >
                            {this.state.buttonMessage}
                        </RegularButton>
                        {this.state.projectData.joined === 2 
                            ?
                            <RegularButton
                                color="primary"
                                onClick={() => this.props.history.push(`/main/projectlist/checkpoint/${match.params.id}`)}
                            >
                                Add Checkpoint Progress
                            </RegularButton> 
                            :
                            null
                        }
                    </div>
                    <div className={classes.commentsDiv}>
                        <Comments projectId={this.state.projectData.id}/>
                    </div>
                </ProposalPage>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)
