import React, {Component} from "react"
import { confirmAlert } from 'react-confirm-alert'

import { 
    withStyles, 
    Avatar, 
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, 
    Divider, 
    List, 
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography, 
    TextField,
    IconButton,
} from "@material-ui/core"
import { Close } from "@material-ui/icons"

import RegularButton from "../CustomButtons/RegularButton"

// Imports of helper or service functions
import config from "../../config"
import { commentsService } from "../../services/commentsService"

import styles from "../../assets/jss/components/commentsStyle"
import 'react-confirm-alert/src/react-confirm-alert.css'


class Comments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: "",
            dialogBoxOpened: false,
            selectedCommentId: 0,
            comments: []
        }
    }

    componentDidMount() {
        commentsService.getComments(this.props.projectId)
            .then(c => c.json())
            .then(json => {
                console.log(json)
                this.setState({
                    comments: json.comments
                })
            }).catch(err => console.log(err))
    }


    handleFormChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    post = () => {
        const today = new Date()
        this.setState({
            date: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
        })

        commentsService.postComment(this.props.projectId, this.state)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                this.setState(() => {
                    const updated_comments = this.state.comments.concat(response.comment)
                return {
                    comments: updated_comments
                }})
            })
            .catch(err => console.log(err))
    }

    deleteComment = (commentId) => {
        this.setState({comments: this.state.comments.filter(comment => comment.commentId !== commentId )})
        commentsService.deleteComment(commentId)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })

    }

    renderConfirmDialog = () => {
        return (
            <Dialog
                open={this.state.dialogBoxOpened}
                onClose={() => {
                    this.setState({dialogBoxOpened: false})
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete comment?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            this.setState({ dialogBoxOpened: false })
                        }} 
                        color="primary"
                    >
                        No
                    </Button>
                    <Button 
                        onClick={() => {
                            this.deleteComment(this.state.selectedCommentId)
                            this.setState({ dialogBoxOpened: false })
                        }} 
                        color="primary" 
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <List>
                    {this.state.comments.map(comment => (
                        <div className={classes.root}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar
                                        alt="Profile Picture"
                                        src="https://picsum.photos/128"
                                    />
                                </ListItemAvatar>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        onClick={() => {
                                            this.setState({
                                                selectedCommentId: comment.commentId,
                                                dialogBoxOpened: true
                                            })
                                        }}
                                    >
                                        <Close fontSize="medium" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                                <ListItemText
                                    primary={comment.ownerFirstName + " " + comment.ownerLastName}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                {comment.date}
                                            </Typography>
                                            {` — ${comment.text}`}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li"/>
                        </div>
                    ))}
                </List>
                <div className={classes.commentsPostDiv}>
                    <TextField
                        id="text"
                        className={classes.commentsPostText}
                        placeholder="Enter your comment here..."
                        margin="normal"
                        variant="outlined"
                        inputProps={{
                            'aria-label': 'bare',
                            onChange: this.handleFormChange
                        }}
                    />
                    <RegularButton
                        color="primary"
                        className={classes.commentsPostButton}
                        onClick={this.post}
                    >
                        {"Post"}
                    </RegularButton>
                </div>
                {this.renderConfirmDialog()}
            </div>
        )
    }
}

export default withStyles(styles)(Comments)