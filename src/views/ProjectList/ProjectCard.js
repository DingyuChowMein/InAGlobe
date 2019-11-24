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

import config from "../../config"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"
import {Close} from "@material-ui/icons";
import {commentsService} from "../../services/commentsService";
import {projectService} from "../../services/projectsService";

class ProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: JSON.parse(localStorage.getItem('user')).permissions,
            userId: JSON.parse(localStorage.getItem('user')).userid,
            projectId: this.props.data.id,
            dialogBoxOpened: false
        };
        this.openProposalPage = this.openProposalPage.bind(this)
    }

    openProposalPage() {
        const dataValue = JSON.stringify(this.props.data)
        localStorage.setItem(`proposalPage/${this.props.data.id}`, dataValue)
        this.props.history.push(`/main/projectlist/proposalpage/${this.props.data.id}`)
    }

    deleteProject = (projectId) => {
        console.log(projectId);
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
                            this.deleteProject(this.state.projectId);
                            this.setState({dialogBoxOpened: false})
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
                </CardActions>
                {this.renderConfirmDialog()}
            </Card>

    )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))
