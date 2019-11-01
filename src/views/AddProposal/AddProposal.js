// Main ReactJS libraries
import React, { Component } from 'react'
import ImageUploader from "react-images-upload"
import { FilePond, registerPlugin } from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"

// Material UI libraries
import { withStyles } from "@material-ui/core"

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import GridItem from "../../components/Grid/GridItem"
import GridContainer from "../../components/Grid/GridContainer"
import CustomInput from '../../components/CustomInput/CustomInput'
import RegularButton from "../../components/CustomButtons/RegularButton"

// Importing the ability to upload to AWS
import upload from "../../s3"
import config from "../../config";
import { generateId } from "../../helpers/utils"

// Importing class's stylesheet
import styles from "../../assets/jss/views/addProposalStyle"
import "filepond/dist/filepond.min.css"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'


class AddProposal extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            images: [],
        };

        this.handleFormChange = this.handleFormChange.bind(this);
        this.post = this.post.bind(this);
        registerPlugin(FilePondPluginImagePreview)
    }

    handleFormChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    post() {
        var token = localStorage.getItem('token');
        var bearer = 'Bearer ' + token;
        console.log(bearer);
        const id = generateId()
        this.state.documents = upload(this.state.documents, id + '/Documents');
        this.state.images = upload(this.state.images, id + '/Images');
        console.log(this.state);

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
            .catch((err) => {console.log(err)});
    }

    render() {
        const { classes } = this.props;
        return (
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
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose images'
                            onChange={pictureFiles => {
                                this.setState({
                                    images: pictureFiles
                                })
                                console.log(this.state.images)
                            }}
                            withPreview={true}
                            imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                            label="Max file size: 10mb. Accepted: .jpg/.gif/.png"
                            maxFileSize={10485760}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <FilePond 
                            allowMultiple={true}
                            files={this.state.documents}
                            onupdatefiles={fileItems => {
                                this.setState({
                                    documents: fileItems.map(fileItem => fileItem.file)
                                })
                                console.log(this.state.documents)
                            }}
                        />
                    </GridItem>
                    <div className={classes.cardButtonDiv}>
                        <RegularButton
                            color="primary"
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
        )
    }
}

export default withStyles(styles)(AddProposal)
