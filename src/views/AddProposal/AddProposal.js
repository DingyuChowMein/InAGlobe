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

class AddProposal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pictures: [],
            documents: []
        }
        this.onDropPictures = this.onDropPictures.bind(this)
        this.onDropDocuments = this.onDropDocuments.bind(this)
    }

    onDropPictures(pictureFiles) {
        this.setState({
            pictures: this.state.pictures.concat(pictureFiles)
        })
    }
    
    onDropDocuments(documentFiles) {
        this.setState({
            documents: this.state.documents.concat(documentFiles)
        })
        console.log(documentFiles)
        console.log(this.state.documents)
    }

    render() {
        const { classes } = this.props
        return (
            <ResponsiveDrawer name={"Add Proposal"}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            id="title"
                            labelText="Project Title"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            id="organisation_name"
                            labelText="Name of Organisation"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            id="location"
                            labelText="Location"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            id="short_des"
                            labelText="Short Description"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                rows: 4,
                                rowsMax: 6
                            }}
                            extraLines={true}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            id="detailed_des"
                            labelText="Detailed Description"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                rows: 6,
                                rowsMax: 12
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
                        imgExtension={['.jpg', '.gif', '.png']}
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
                        <Button color="primary" className={classes.previewButton}>
                            {"Preview"}
                        </Button>
                        <Button 
                            color="primary" 
                            // onClick={upload(this.state.documents[0])}
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