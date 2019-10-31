// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ProposalPage from "./ProposalPage"

// Importing class's stylesheet
import styles from "../../assets/jss/views/proposalMainPageStyle"
import RegularButton from '../../components/CustomButtons/RegularButton'
import config from "../../config";

class ProposalMainPage extends Component {

    constructor(props) {
        super(props);
        this.actionButtonClicked = this.actionButtonClicked.bind(this);
        this.getButtonMessage = this.getButtonMessage.bind(this);
        const userType = localStorage.getItem('permissions');
        const projectData = JSON.parse(localStorage.getItem(`proposalPage/${this.props.match.params.id}`));
        this.state = {
            userType: userType,
            projectData: projectData,
            buttonDisabled: !(userType === "0" || (userType !== "1"  && projectData.status === "Approved")),
            buttonMessage: this.getButtonMessage(userType, projectData.status)
        }

        console.log(this.state.userType);
        console.log(this.state.buttonDisabled);
    }

    actionButtonClicked() {
        const token = localStorage.getItem('token');
        const bearer = 'Bearer ' + token;

        if (this.state.userType === "0") {
            var new_project_data = this.state.projectData;
            new_project_data.status = new_project_data.status === "Approved" ? "Needs Approval" : "Approved";
            this.setState({
                projectData: new_project_data,
                buttonMessage: this.getButtonMessage(this.state.userType, new_project_data.status)});

            fetch(config.apiUrl + '/approve/', {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({"ProjectId": this.state.projectData.id}),
            }).then((response) => {
                // Redirect here based on response
                console.log(response)
            })
                .catch((err) => {
                    console.log(err)
                });
        }
    }

    getButtonMessage(userType, status) {
        if (userType === "0") {
            if (status === "Needs Approval") {
                return "Approve"
            }
            return "Disapprove"
        } else if (userType === "1") {
            return status
        } else {
            return "Select project";
        }
    }

    render() {
        const proposalData = this.state.projectData;
        return (
            <ProposalPage {...this.props} data={proposalData}>
                <RegularButton
                    onClick={this.actionButtonClicked}
                    disabled={this.state.buttonDisabled}
                >
                    {this.state.buttonMessage}
                </RegularButton>
            </ProposalPage>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)