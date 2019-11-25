import React from 'react';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import {projectService} from '../../services/projectsService'

var data = {}

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


export default function ProjectDialogue({ProjectData}) {
    const classes = useStyles();

    return (
        <>
            <EditModal classes={classes} ProjectData={ProjectData} />
            <DeleteModal classes={classes} ProjectData={ProjectData} />
        </>
    );
}

function EditModal({classes, ProjectData}) {
    //console.log(ProjectData);
    const [openEdit, setOpenEdit] = React.useState(false);

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleSave = () => {
        setOpenEdit(false);
        projectService.updateProject(ProjectData.id, data)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className={classes.root}>
            <Fab color="secondary" aria_label="edit">
                <EditIcon onClick={handleClickOpenEdit} />
            </Fab>
            <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="edit-dialogue">
                <DialogTitle id="edit-title-dialogue">
                    Edit project
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update this project, just fill out the form.
                    </DialogContentText>
                    <EditTextFields ProjectData={ProjectData}/>
                </DialogContent>
                <DialogActions>
                    <Fab aria_label="close">
                        <CloseIcon onClick={handleCloseEdit} />
                    </Fab>
                    <Fab color="primary" aria_label="save">
                        <SaveIcon onClick={handleSave} />
                    </Fab>
                </DialogActions>
            </Dialog>
        </div>
    )
}

function EditTextFields({ProjectData}){
    const [title, setTitle] = React.useState(ProjectData.title);
    const [shortDescription, setShortDescription] = React.useState(ProjectData.shortDescription);
    const [detailedDescription, setDetailedDescription] = React.useState(ProjectData.detailedDescription);

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
                variant="outlined"
                defaultValue={title}
                onChange={e => changeTitle(e.target.value)}
                margin="normal"
                fullWidth
                autoFocus
            />
            <TextField
                id="shortDescription"
                label="shortDescription"
                variant="outlined"
                defaultValue={shortDescription}
                onChange={e => changeShortDescription(e.target.value)}
                margin="normal"
                fullWidth
                multiline
                rows="2"
                autoFocus
            />
            <TextField
                id="detailedDescription"
                label="detailedDescription"
                variant="outlined"
                defaultValue={detailedDescription}
                onChange={e => changeDetailedDescription(e.target.value)}
                margin="normal"
                fullWidth
                multiline
                rows="4"
                autoFocus
            />
        </div>
    )

}

function DeleteModal({classes, ProjectData}){
    const [openDelete, setOpenDelete] = React.useState(false)

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDelete = () => {
        setOpenDelete(false);
        projectService.deleteProject(ProjectData.id)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className={classes.root}>
            <Fab aria_label="delete">
                <DeleteOutlineIcon onClick={handleClickOpenDelete} />
            </Fab>
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="delete-dialogue">
                <DialogTitle id="delete-title-dialogue">
                    Delete Comment?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-content-dialogue">
                        Are you sure you want to delete this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="outlined" onClick={handleCloseDelete}>
                        No
                    </Button>
                    <Button color="secondary" variant="outlined" onClick={handleDelete}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}