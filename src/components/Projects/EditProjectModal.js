import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {projectService} from '../../services/projectsService'

var data = {}

function TextFields({ProjectData}){
    const [title, setTitle] = useState(ProjectData.title);
    const [shortDescription, setShortDescription] = useState(ProjectData.shortDescription);
    const [detailedDescription, setDetailedDescription] = useState(ProjectData.detailedDescription);

    const changeTitle = (title) => {
        setTitle(title);
        data['title'] = title;
    }
    const changeShortDescription = (shortDescription) => {
        setShortDescription(shortDescription);
        data['shortDescription'] = shortDescription;
    }
    const changeDetailedDescription = (detailedDescription) => {
        setDetailedDescription(detailedDescription)
        data['detailedDescription'] = detailedDescription;
    }

    return (
        <div>
            <TextField
                id="title"
                label="title"
                defaultValue={title}
                onChange={e => changeTitle(e.target.value)}
                fullwidth
                margin="dense"
                autoFocus
            />
            <TextField
                id="shortDescription"
                label="shortDescription"
                defaultValue={shortDescription}
                onChange={e => changeShortDescription(e.target.value)}
                fullwidth
                margin="dense"
                autoFocus
            />
            <TextField
                id="detailedDescription"
                label="detailedDescription"
                defaultValue={detailedDescription}
                onChange={e => changeDetailedDescription(e.target.value)}
                fullwidth
                margin="dense"
                autoFocus
            />
        </div>
    )

}

export default function FormDialog({ProjectData}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        setOpen(false);
        projectService.updateProject(ProjectData.id, data)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Edit project
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit project</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To update this project, just fill out the form.
                </DialogContentText>
                <TextFields ProjectData={ProjectData}/>
            </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}