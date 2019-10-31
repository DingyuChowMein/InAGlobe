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
        this.state = {
            buttonDisabled: true
        }
    }

    actionButtonClicked() {
        var token = localStorage.getItem('token');
        var bearer = 'Bearer ' + token;
        const userType = localStorage.getItem('permissions');

        if (userType === "0") {
            fetch(config.apiUrl + '/projects/', {
                method: 'post',
                headers: {
                    'Authorization': bearer,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(this.state),
            }).then((response) => {
                // Redirect here based on response
                this.props.history.push("/main/projectlist")
            })
                .catch((err) => {
                    console.log(err)
                });
        }
    }

    getButtonMessage(status) {
        const userType = localStorage.getItem('permissions');
        if (userType === "0") {
            if (status === "Needs Approval") {
                this.setState({
                    buttonDisabled: false
                })
                return "Approve"
            }
            return "Approved"
        } else if (userType === "1") {
            return status
        } else {
            if (status === "Needs Approval") {
                return status;
            }
            this.setState({
                buttonDisabled: false
            })
            return "Select project";
        }
    }

    render() {
        const { match } = this.props
        const proposalData = JSON.parse(localStorage.getItem(`proposalPage/${match.params.id}`))
        const buttonMessage = this.getButtonMessage(proposalData.status)
        return (
            <ProposalPage {...this.props} data={proposalData}>
                <RegularButton
                    onClick={this.actionButtonClicked}
                    disabled={this.state.buttonDisabled}
                >
                    {buttonMessage}
                </RegularButton>
            </ProposalPage>
        )
    }
}

export default withStyles(styles)(ProposalMainPage)