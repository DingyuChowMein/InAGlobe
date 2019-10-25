import React from "react"
import ImageUploader from "react-images-upload"
// import { makeStyles } from "@material-ui/core/styles"

// @material-ui/core components
import Grid from "@material-ui/core/Grid"

// @material-ui/icons
import Description from "@material-ui/icons/Description"

//core components
import CustomInput from "../../components/CustomInput/CustomInput.js"
import GridItem from "../../components/Grid/GridItem.js"

// import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js"
import { Button } from "@material-ui/core"

// const useStyles = makeStyles(styles)
import upload from "../../s3.js"

const pictures = []
const documents = []

const onDropPictures = pictureFiles => {
    pictures.push(pictureFiles)
}

const onDropDocuments = documentFiles => {
    documents.push(documentFiles)
    console.log(documentFiles)
    console.log(documents)
}

export default function AddProposal() {

    return (
        <Grid container>
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
                onChange={onDropPictures}
                withPreview={true}
                imgExtension={['.jpg', '.gif', '.png']}
                label="Max file size: 10mb. Accepted: .jpg/.gif/.png"
                maxFileSize={10485760}
            />
            <ImageUploader
                withIcon={true}
                buttonText='Choose documents'
                onChange={onDropDocuments}
                imgExtension={['.docx', '.doc', '.pdf', '.odf']}
                label="Max file size: 10mb. Accepted: .docx/.doc/.pdf/.odf"
                maxFileSize={10485760}
                withPreview={true}
                accept="accept/file/*"
                defaultImage={Description}
            />
            <div style={{ width: "100%", textAlign: "center" }}>
                <Button color="primary" style={{ marginRight: "10%" }}>{"Preview"}</Button>
                <Button 
                    color="primary" 
                    onClick={() => {upload(documents[0])}}
                    style={{ marginLeft: "10%" }}>{"Submit"}
                </Button>
            </div>
        </Grid>
    )
    
}

