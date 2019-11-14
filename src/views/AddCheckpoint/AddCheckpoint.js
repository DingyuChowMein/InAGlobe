import React, {Component} from 'react'
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

import {withStyles} from "@material-ui/core"
import RegularButton from "../../components/CustomButtons/RegularButton";
import styles from "../../assets/jss/views/addCheckpointStyle"
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer";
import {FilePond, registerPlugin} from "react-filepond";
import {generateId} from "../../helpers/utils";

import upload from "../../s3"
import {checkpointService} from "../../services/checkpointService";
import CustomInput from "../../components/CustomInput/CustomInput";

class AddCheckpoint extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                title: "",
                subtitle: "",
                text: "",
                documents: [],
                images: [],
            },
            open: false
        };
        registerPlugin(FilePondPluginImagePreview);
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
    };

    post = () => {
        const id = generateId();
        this.state.data.documents = upload(this.state.data.documents, id + '/Documents')
        this.state.data.images = upload(this.state.data.images, id + '/Images');
        console.log(this.state.data);
        const {match} = this.props;
        checkpointService.postCheckpoint(match.params.id, this.state.data)
            .then((response) => {
                console.log(response);

                // Redirect here based on response
                this.props.history.push("/main/projectlist/")
            }).catch((err) => {
            console.log(err)
        })
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <ResponsiveDrawer name={"Add Checkpoint"}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="title"
                                labelText="Title"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="subtitle"
                                labelText="Subtitle"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <CustomInput
                                id="text"
                                labelText="Text"
                                inputProps={{onChange: this.handleFormChange}}
                                formControlProps={{
                                    fullWidth: true
                                }}
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
                                }}
                            />
                        </GridItem>
                        <RegularButton
                            color="primary"
                            onClick={this.post}
                            className={classes.submitButton}
                        >
                            {"Submit"}
                        </RegularButton>
                    </GridContainer>
                </ResponsiveDrawer>
            </div>
        )
    }
}

export default withStyles(styles)(AddCheckpoint)
