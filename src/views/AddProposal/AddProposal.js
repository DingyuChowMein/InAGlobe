// Main ReactJS libraries
import React, { Component } from 'react'
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

// Material UI libraries
import { withStyles } from "@material-ui/core"
import Dialog from '@material-ui/core/Dialog'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import GridItem from "../../components/Grid/GridItem"
import GridContainer from "../../components/Grid/GridContainer"
import CustomInput from '../../components/CustomInput/CustomInput'
import RegularButton from "../../components/CustomButtons/RegularButton"

// Importing the ability to upload to AWS
import upload from "../../s3"
import config from "../../config"
import { generateId } from "../../helpers/utils"

// Importing class's stylesheet
import styles from "../../assets/jss/views/addProposalStyle"
import "filepond/dist/filepond.min.css"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import ProposalPreviewPage from '../ProposalPage/ProposalPreviewPage'


class AddProposal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {
                id: "",
                title: "",
                shortDescription: "",
                detailedDescription: "",
                location: "",
                projectOwner: "",
                documents: [],
                organisationName: "",
                organisationLogo: "",
                status: "",
                images: []
            },
            open: false
        }
        registerPlugin(FilePondPluginImagePreview)
        registerPlugin(FilePondPluginFileValidateType)
    }

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
        var token = localStorage.getItem('token')
        var bearer = 'Bearer ' + token
        console.log(bearer)
        const id = generateId()
        this.state.data.documents = upload(this.state.data.documents, id + '/Documents')
        this.state.data.images = upload(this.state.data.images, id + '/Images')
        console.log(this.state.data)

        fetch(config.apiUrl + '/projects/', {
            method: 'post',
            headers: {
                'Authorization': bearer,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state.data),
        }).then((response) => {
            console.log(response)
            // Redirect here based on response
            this.props.history.push("/main/projectlist")
        }).catch((err) => {
            console.log(err)
        })
    }

    previewProposal = () => {
        this.setState({
            open: true
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <ResponsiveDrawer name={"Add Proposal"}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="title"
                                labelText="Project Title"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="organisation"
                                labelText="Name of Organisation"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="location"
                                labelText="Location"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="shortDescription"
                                labelText="Short Description"
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    rows: 4,
                                    rowsMax: 6,
                                    onChange: this.handleFormChange
                                }}
                                extraLines={true}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="detailedDescription"
                                labelText="Detailed Description"
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    rows: 6,
                                    rowsMax: 12,
                                    onChange: this.handleFormChange
                                }}
                                placeholder="Detailed Description"
                                extraLines={true}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <FilePond 
                                allowMultiple={true}
                                files={this.state.data.images}
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
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <FilePond 
                                allowMultiple={true}
                                files={this.state.data.documents}
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
                                    console.log(this.state.data.documents)
                                }}
                            />
                        </GridItem>
                        <div className={classes.cardButtonDiv}>
                            <RegularButton
                                color="primary"
                                onClick={this.previewProposal}
                                className={classes.previewButton}
                            >
                                {"Preview"}
                            </RegularButton>
                            <RegularButton 
                                color="primary"
                                onClick={this.post}
                                className={classes.submitButton}
                            >
                                {"Submit"}
                            </RegularButton>
                        </div>
                    </GridContainer>
                </ResponsiveDrawer>
                <Dialog 
                    fullWidth="true"
                    maxWidth="lg"
                    open={this.state.open}
                    onClose={() => this.setState({
                        open: false
                    })}
                    aria-labelledby="proposalPreviewTitle">
                        <ProposalPreviewPage data={this.state.data} />
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(AddProposal)
