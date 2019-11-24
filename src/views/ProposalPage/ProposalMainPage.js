// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, IconButton,
    withStyles
} from '@material-ui/core'

// Imports of different components in project
import AddCheckpointModal from "../AddCheckpoint/AddCheckpoint"
import Comments from '../../components/Comments/Comments'
import ProposalPage from "./ProposalPage"
import RegularButton from '../../components/CustomButtons/RegularButton'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import config from "../../config"
import { commentsService } from "../../services/commentsService"

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"
import {projectService} from "../../services/projectsService";
import {Close} from "@material-ui/icons";

class ProposalMainPage extends Component {

    constructor(props) {
        super(props);
        const userType = JSON.parse(localStorage.getItem('user')).permissions;
        const projectData = JSON.parse(localStorage.getItem(`proposalPage/${this.props.match.params.id}`));
        console.log(projectData);
        this.state = {
            userId: JSON.parse(localStorage.getItem('user')).userId,
            userType: userType,
            dialogBoxOpened: false,
            projectData: projectData,
            buttonDisabled: !(userType === 0 || (userType !== 1 && projectData.status === "Approved" && projectData.joined === 0)),
            buttonMessage: this.getButtonMessage(userType, projectData.status, projectData.joined),
            comments: [],
            showModal: false,
        };

        console.log("UserType:" + this.state.userType);
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

    deleteProject = (projectId) => {
        projectService.deleteProject(projectId)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err)
            })

    };

    hasPermissions = (ownerId) => {
        return (this.state.userType === 0 || this.state.userId === ownerId)
    };

    renderConfirmDialog = () => {
        return (
            <Dialog
                open={this.state.dialogBoxOpened}
                onClose={() => {
                    this.setState({dialogBoxOpened: false})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete comment?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            this.setState({dialogBoxOpened: false})
                        }}
                        color="primary"
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            this.deleteProject(this.state.projectData.id);
                            this.setState({dialogBoxOpened: false})
                            // TODO add redirect to projectlist
                        }}
                        color="primary"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    };

    render() {
        const {classes, match} = this.props;
        const proposalData = JSON.parse(localStorage.getItem(`proposalPage/${match.params.id}`));
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
                        {this.hasPermissions(this.state.userId) ?
                        <IconButton
                                onClick={() => {
                                    this.setState({
                                        dialogBoxOpened: true
                                    })
                                }}
                            >
                                <Close fontSize="medium"/>
                            </IconButton>
                            :
                            <></>
                        }
                    </div>
                    <div className={classes.commentsDiv}>
                        <Comments projectId={this.state.projectData.id}/>
                    </div>
                    {this.renderConfirmDialog()}
                </ProposalPage>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)
