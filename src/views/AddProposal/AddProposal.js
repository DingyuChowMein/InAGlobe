// Main ReactJS libraries
import React, { Component } from 'react'
import ImageUploader from "react-images-upload"

// Material UI libraries
import { withStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Description from "@material-ui/icons/Description"

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import GridItem from "../../components/Grid/GridItem"
import GridContainer from "../../components/Grid/GridContainer"
import CustomInput from '../../components/CustomInput/CustomInput'

// Importing the ability to upload to AWS
import upload from "../../s3"

// Importing class's stylesheet
import styles from "../../assets/jss/views/addProposalStyle"
import config from "../../config";
import { generateId } from "../../helpers/utils"


class AddProposal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            title: "",
            shortDescription: "",
            detailedDescription: "",
            location: "",
            projectOwner: "NaN",
            documents: [],
            organisationName: "",
            organisationLogo: "",
            status: "",
            images: [],
        };

        this.onDropPictures = this.onDropPictures.bind(this)
        this.onDropDocuments = this.onDropDocuments.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this);
        this.post = this.post.bind(this);
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

    onDropPictures(pictureFiles) {
        this.setState({['images']: pictureFiles});
    }
    
    onDropDocuments(documentFiles) {
        this.setState({['documents']: documentFiles});
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
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDropPictures}
                        withPreview={true}
                        imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                        label="Max file size: 10mb. Accepted: .jpg/.gif/.png"
                        maxFileSize={10485760}
                    />
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose documents'
                        onChange={this.onDropDocuments}
                        imgExtension={['.docx', '.doc', '.pdf', '.odf']}
                        label="Max file size: 10mb. Accepted: .docx/.doc/.pdf/.odf"
                        maxFileSize={10485760}
                        withPreview={true}
                        accept="accept/file/*"
                        defaultImage={Description}
                    />
                    <div className={classes.cardButtonDiv}>
                        <Button
                            color="primary"
                            className={classes.previewButton}
                        >
                            {"Preview"}
                        </Button>
                        <Button 
                            color="primary"
                            onClick={this.post}
                            className={classes.submitButton}
                        >
                            {"Submit"}
                        </Button>
                    </div>
                </GridContainer>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(AddProposal)
