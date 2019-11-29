// Main ReactJS libraries
import React, { Component } from 'react'
import ImageUploader from 'react-images-upload'
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
    IconButton,
    Avatar,
    Typography
} from "@material-ui/core"
import { Close, Create } from '@material-ui/icons'

// Imports of different components in project
import CustomInput from '../../components/CustomInput/CustomInput'
import RegularButton from "../../components/CustomButtons/RegularButton"
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing the helper functions from other files
import { upload, download } from "../../s3"
import config from "../../config"
import { generateId } from "../../helpers/utils"
import { userService } from "../../services/userService"
import cloneDeep from "lodash.clonedeep"

// Importing class's stylesheet
import imageNull from "../../assets/img/imageNull.png"
import styles from "../../assets/jss/views/editProfileStyle"
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
            profilePicEdit: false,
            submissionResult: "",
            submitting: false,
        }
        this.images = null
        this.documents = null
        registerPlugin(FilePondPluginImagePreview)
        registerPlugin(FilePondPluginFileValidateType)
    }

    componentDidMount() {
        const images = this.state.data.images.map(image => download(image))
        const documents = this.state.data.documents.map(document => download(document))
        console.log(images)
        console.log(documents)
        this.images.addFiles(images)
        this.documents.addFiles(documents)
    }

    checkIfNotEmpty = () => Object.values(this.state.data).every(e => !e || e.length !== 0)

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
            delete modifiedData.token

            modifiedData.profilePicture = upload([modifiedData.profilePicture], id + '/Images')[0]
            modifiedData.documents = upload(modifiedData.documents, id + '/Documents')
            modifiedData.images = upload(modifiedData.images, id + '/Images')

            console.log(modifiedData)

            userService.updateProfile(this.state.data.userId, modifiedData)
                .then(response => {
                    console.log(response)
                    this.setState({
                        submitting: false,
                        submissionResult: "Submission Successful"
                    })
                }).catch(err => {
                    console.log(err)
                    this.setState({
                        submitting: false,
                        submissionResult: "Submission Unsuccessful"
                    })
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

        let userTypeText
        switch (this.state.data.permissions) {
            case 0:
                userTypeText = "Admin"
                break
            case 1:
                userTypeText = "Humanitarian"
                break
            case 2:
                userTypeText = "Academic"
                break
            case 3:
                userTypeText = "Student"
                break
            default:
                console.log("Big User Type Error!!!!")
        }

        const { profilePicture } = this.state.data
        let pic
        if (profilePicture) {
            if (typeof profilePicture === "string") {
                pic = config.s3Bucket + profilePicture
            } else {
                pic = URL.createObjectURL(profilePicture)
            }
        } else {
            pic = imageNull
        }

        const avatarComp = (
            <Avatar 
                alt="Profile Picture"
                src={pic}
                className={classes.avatar}
            />
        )

        return (
            <div>
                <ResponsiveDrawer name={"Add Proposal"}>
                    <Grid container>
                        <Grid item xs={12} className={classes.rightAlign}>
                            <RegularButton
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        submitting: true,
                                        submissionOpen: true
                                    })
                                    this.post()
                                }}
                                style={{ marginLeft: "40px" }}
                            >
                                Submit Changes
                            </RegularButton>
                            <RegularButton
                                color="primary"
                                onClick={this.resetData}
                            >
                                Reset Changes
                            </RegularButton>
                        </Grid>
                        <Grid item xs={12} className={classes.centeringAvatar}>
                            {avatarComp}
                            <IconButton
                                onClick={() => this.setState({
                                    profilePicEdit: true
                                })}
                            >
                                <Create fontSize="medium" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <Typography component="h5" variant="h5">
                                <b>User Type: </b>
                                {userTypeText}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <CustomInput
                                        id="firstName"
                                        labelText="First Name"
                                        inputProps={{
                                            onChange: this.handleFormChange,
                                            required: "true",
                                            defaultValue: this.state.data.firstName,
                                            style: { marginRight: "30px" }
                                        }}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInput
                                        id="lastName"
                                        labelText="Last Name"
                                        inputProps={{
                                            onChange: this.handleFormChange,
                                            required: "true",
                                            defaultValue: this.state.data.lastName,
                                            style: { marginLeft: "30px" }
                                        }}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <CustomInput
                                id="email"
                                labelText="Email Address"
                                inputProps={{
                                    onChange: this.handleFormChange,
                                    required: "true",
                                    defaultValue: this.state.data.email
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <CustomInput
                                id="location"
                                labelText="Location"
                                inputProps={{
                                    onChange: this.handleFormChange,
                                    required: "true",
                                    defaultValue: this.state.data.location
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <CustomInput
                                id="shortDescription"
                                labelText="Summary"
                                inputProps={{
                                    rows: 4,
                                    rowsMax: 6,
                                    onChange: this.handleFormChange,
                                    required: "true",
                                    defaultValue: this.state.data.shortDescription
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                                extraLines={true}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <CustomInput
                                id="longDescription"
                                labelText="Biography"
                                inputProps={{
                                    rows: 6,
                                    rowsMax: 12,
                                    onChange: this.handleFormChange,
                                    required: "true",
                                    defaultValue: this.state.data.longDescription
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                                extraLines={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FilePond
                                ref={ref => this.images = ref}
                                allowMultiple={true}
                                labelIdle='Drag & Drop your images (.jpg, .png. or .bmp) or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={["image/*"]}
                                onupdatefiles={pictureItems => {
                                    this.setState({
                                        data: {
                                            ...this.state.data,
                                            images: pictureItems.map(pictureItem => pictureItem.file)
                                        }
                                    
                                    })
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FilePond
                                ref={ref => this.documents = ref}
                                allowMultiple={true}
                                labelIdle='Drag & Drop your documents (.pdf, .docx, .doc, .txt and .odt) or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={[
                                    "application/msword",
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    "application/pdf",
                                    "text/plain",
                                    "application/vnd.oasis.opendocument.text"
                                ]}
                                onupdatefiles={fileItems => {
                                    this.setState({
                                        data: {
                                            ...this.state.data,
                                            documents: fileItems.map(fileItem => fileItem.file)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>
                </ResponsiveDrawer>

                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={this.state.profilePicEdit}
                    onClose={() => this.setState({
                        profilePicEdit: false
                    })}
                    aria-labelledby="profilePicDialogTitle"
                    aria-describedby="profilePicDialogDes"
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <DialogTitle id="previewDialogTitle">
                                        Edit Profile Picture
                                    </DialogTitle>
                                </Grid>
                                <Grid item xs={2} className={classes.rightAlign}>
                                    <IconButton 
                                        onClick={() => this.setState({
                                            profilePicEdit: false
                                        })}
                                    >
                                        <Close fontSize="medium" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.centering}>
                            {avatarComp}
                        </Grid>
                        <Grid item xs={12} className={classes.leftAlign}>
                            <ImageUploader 
                                withIcon={true}
                                buttonText="Choose image"
                                onChange={pictureFiles => {
                                    if (pictureFiles.length > 0) {
                                        console.log(pictureFiles[pictureFiles.length - 1])
                                        this.setState({
                                            data: {
                                                ...this.state.data,
                                                profilePicture: pictureFiles[pictureFiles.length - 1]
                                            }
                                        })
                                    }
                                }}
                                singleImage={true}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.rightAlign}>
                            <RegularButton
                                color="primary"
                                onClick={() => this.setState({
                                    profilePicEdit: false
                                })}
                                style={{ marginLeft: "20px", marginRight: "20px" }}
                            >
                                Done
                            </RegularButton>
                            <RegularButton
                                color="primary"
                                onClick={() => this.setState({
                                    data: {
                                        ...this.state.data,
                                        profilePicture: imageNull
                                    }
                                })}
                            >
                                Set Blank
                            </RegularButton>
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
                                this.props.history.push("/main/userprofile")
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