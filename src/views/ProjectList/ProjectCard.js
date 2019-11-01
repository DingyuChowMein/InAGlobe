// Main ReactJS libraries
import React, { Component } from "react"
import { Switch, Redirect, withRouter } from "react-router-dom"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Imports of different components in project
import RegularButton from "../../components/CustomButtons/RegularButton"
import Card from "../../components/Card/Card"
import CardBody from "../../components/Card/CardBody"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"
import config from "../../config";

class ProjectCard extends Component {
    constructor(props) {
        super(props)
        this.openProposalPage = this.openProposalPage.bind(this)
        this.markAsSelected = this.markAsSelected.bind(this)
        const projectData = JSON.parse(localStorage.getItem(`proposalPage/${this.props.match.params.id}`));

        // this.state = {
        //     // userType: userType,
        //     projectData: projectData,
        //     // buttonDisabled: !(userType === "0" || (userType !== "1" && projectData.status === "Approved")),
        //     // buttonMessage: this.getButtonMessage(userType, projectData.status),
        //     // comments: []
        // };

    }

    openProposalPage() {
        const dataValue = JSON.stringify(this.props.data)
        localStorage.setItem(`proposalPage/${this.props.data.id}`, dataValue)
        this.props.history.push(`/main/projectlist/proposalpage/${this.props.data.id}`)
    }

    markAsSelected() {
      // const token = localStorage.getItem('token');
      // const bearer = 'Bearer ' + token;
      //
      //     fetch(config.apiUrl + '/dashboard/', {
      //         method: 'post',
      //         headers: {
      //             'Authorization': bearer,
      //             'Content-type': 'application/json'
      //         },
      //         body: JSON.stringify({"ProjectId": this.state.projectData.id}),
      //     }).then((response) => {
      //         // Redirect here based on response
      //         console.log(response)
      //     })
      //         .catch((err) => {
      //             console.log(err)
      //         });
    }

    render() {
        const { classes } = this.props
        const {
            title,
            organisation,
            status,
            shortDescription,
            images } = this.props.data

        return (
            <Card>
                <img
                    className={classes.cardImgTop}
                    alt="Provided for a Card."
                    src={config.s3Bucket + images[0]}
                />
                <CardBody>
                    <h3 className={classes.h3}>{title}</h3>
                    <h4 className={classes.h4}>{organisation}</h4>
                    <h5 className={classes.h5}>{status}</h5>
                    <p>{shortDescription}</p>
                    <div className={classes.buttonDiv}>
                        <RegularButton
                            color="primary"
                            className={classes.learnMoreButton}
                            onClick={this.openProposalPage}
                        >
                            Learn More
                        </RegularButton>
                        <RegularButton
                            color="primary"
                            className={classes.selectProposalButton}
                            onClick={this.markAsSelected}
                        >
                            Select Proposal
                        </RegularButton>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))
