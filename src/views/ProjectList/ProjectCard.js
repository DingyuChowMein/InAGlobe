// Main ReactJS libraries
import React, { Component } from "react"
import { withRouter } from "react-router-dom"


// Material UI libraries
import {
    withStyles,
    Card,
    CardContent,
    CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from "@material-ui/core"

// Imports of different components in project
import RegularButton from "../../components/CustomButtons/RegularButton"

import EditProject from "../../components/Projects/EditProjectModal"

import config from "../../config"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"
import {Close} from "@material-ui/icons";
import {projectService} from "../../services/projectsService";

class ProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: JSON.parse(localStorage.getItem('user')).permissions,
            userId: JSON.parse(localStorage.getItem('user')).userId,
            projectId: this.props.data.id,
            deleteBox: false
        };
        this.openProposalPage = this.openProposalPage.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.renderWithPermissions = this.renderWithPermissions.bind(this);
        this.renderConfirmDialog = this.renderConfirmDialog.bind(this);
    }

    openProposalPage() {
        const dataValue = JSON.stringify(this.props.data)
        localStorage.setItem(`proposalPage/${this.props.data.id}`, dataValue)
        this.props.history.push(`/main/projectlist/proposalpage/${this.props.data.id}`)
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

    renderWithPermissions = (ownerId) => {
        if (this.state.userType === 0 || this.state.userId === ownerId) {
              return (
                  <>
                      <EditProject ProjectData={this.props.data} />
                      <IconButton onClick={() => {
                                this.setState({
                                    deleteBox: true
                                })
                            }}>
                          <Close fontSize="medium"/>
                      </IconButton>
                  </>
              )
        }
    };

    renderConfirmDialog = () => {
        return (
            <Dialog
                open={this.state.deleteBox}
                onClose={() => {
                    this.setState({deleteBox: false})
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
                            this.setState({deleteBox: false})
                        }}
                        color="primary"
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            this.deleteProject(this.state.projectId);
                            this.setState({deleteBox: false})
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
        const { classes } = this.props;
        const {
            title,
            organisation,
            status,
            shortDescription,
            images } = this.props.data;

        return (
            <Card className={classes.cardDiv}>
                <img
                    className={classes.cardImgTop}
                    alt="Provided for a Card."
                    src={config.s3Bucket + images[0]}
                />
                <CardContent>
                    <h3>{title}</h3>
                    <h4>{organisation}</h4>
                    <h5>{status}</h5>
                    <p>{shortDescription}</p>
                </CardContent>
                <CardActions className={classes.buttonDiv}>
                    <RegularButton
                        color="primary"
                        className={classes.learnMoreButton}
                        onClick={this.openProposalPage}
                    >
                        Learn More
                    </RegularButton>
                    {this.renderWithPermissions(this.state.userId)}
                </CardActions>
                {this.renderConfirmDialog()}
            </Card>

    )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))
