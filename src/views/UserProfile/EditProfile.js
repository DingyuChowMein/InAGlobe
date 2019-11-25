// Main ReactJS libraries
import React, { Component } from 'react'
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

// Material UI libraries
import { 
    withStyles,
    CircularProgress, 
    Dialog, 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid, 
    IconButton
} from "@material-ui/core"
import { Close } from '@material-ui/icons'

// Imports of different components in project
import CustomInput from '../../components/CustomInput/CustomInput'
import ProposalPreviewPage from '../ProposalPage/ProposalPreviewPage'
import RegularButton from "../../components/CustomButtons/RegularButton"
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing the helper functions from other files
import upload from "../../s3"
import { generateId } from "../../helpers/utils"
import { userService } from "../../services/userService"
import cloneDeep from "lodash.clonedeep"

// Importing class's stylesheet
import styles from "../../assets/jss/views/addProposalStyle"
import "filepond/dist/filepond.min.css"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import UserProfile from './UserProfile'


class EditProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: JSON.parse(localStorage.getItem("user")),
            previewOpen: false,
            submissionOpen: false,
            submissionResult: "",
            submitting: false,
        }
        registerPlugin(FilePondPluginImagePreview)
        registerPlugin(FilePondPluginFileValidateType)
    }

    checkIfNotEmpty = () => Object.values(this.state.data).every(e => e.length !== 0)

    handleFormChange = (event) => {
        console.log(event.target.id)
        console.log(event.target.value)
        this.setState({
            data: {
                ...this.state.data,
                [event.target.id]: event.target.value
            }
        })
    }

    post = () => {
        if (this.checkIfNotEmpty()) {
            const id = generateId()
            const modifiedData = cloneDeep(this.state.data)
            modifiedData.documents = upload(modifiedData.documents, id + '/Documents')
            modifiedData.images = upload(modifiedData.images, id + '/Images')
            console.log(modifiedData)
            userService.updateProfile(modifiedData)
                .then(response => {
                    console.log(response)
                    this.setState({
                        submitting: false,
                        submissionResult: "Submission Successful"
                    })
                }).catch(err => {
                    console.log(err)
                })
        } else {
            this.setState({
                submitting: false,
                submissionResult: "Please fill in all the entries provided."
            })
        }
    }

    resetData = () => {
        this.setState({
            data: JSON.parse(localStorage.getItem("user"))
        })
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <ResponsiveDrawer name={"Add Proposal"}>
                    <Grid container>
                        <Grid item xs={12} className={classes.rightAlign}>
                            <RegularButton
                                color="primary"
                                onClick={this.resetData}
                            >
                                Reset Changes
                            </RegularButton>
                            <RegularButton
                                color="primary"
                                onClick={() => null}
                            >
                                Submit Changes
                            </RegularButton>
                        </Grid>
                    </Grid>
                </ResponsiveDrawer>

                <Dialog
                    fullWidth={true}
                    maxWidth="lg"
                    open={this.state.previewOpen}
                    onClose={() => this.setState({
                        previewOpen: false
                    })}
                    aria-labelledby="previewDialogTitle"
                    aria-describedby="previewDialogDes">
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <DialogTitle id="previewDialogTitle">
                                            Project Preview
                                        </DialogTitle>
                                    </Grid>
                                    <Grid item xs={2} className={classes.rightAlign}>
                                        <IconButton 
                                            onClick={() => this.setState({
                                                previewOpen: false
                                            })}
                                        >
                                            <Close fontSize="medium" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <DialogContent>
                                    {this.checkIfNotEmpty() 
                                        ? 
                                        <UserProfile />
                                        : 
                                        <DialogContentText 
                                            id="previewDialogDes" 
                                            className={classes.centering}
                                        >
                                            Please fill in all the entries provided before previewing.
                                        </DialogContentText>
                                    }
                                </DialogContent>
                            </Grid>
                        </Grid>
                </Dialog>

                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={this.state.submissionOpen}
                    onClose={() => this.setState({
                        submissionOpen: false
                    })}
                    aria-labelledby="submissionDialogTitle"
                    aria-describedby="submissionDialogDes"
                >
                    <DialogTitle id="submissionDialogTitle">
                        Submission Result
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="submissionDialogDes" className={classes.centering}>
                            {this.state.submitting ? <CircularProgress /> : this.state.submissionResult}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <RegularButton 
                            color="primary" 
                            onClick={() => this.setState({
                                submissionOpen: false
                            })}
                            className={classes.closeButton}>
                            Close
                        </RegularButton>
                        <RegularButton 
                            color="primary" 
                            onClick={() => {
                                this.setState({
                                    submissionOpen: false
                                })
                                this.props.history.push("/main/projectlist")
                            }}
                            className={classes.okButton}
                        >
                            Ok
                        </RegularButton>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default withStyles(styles)(EditProfile)