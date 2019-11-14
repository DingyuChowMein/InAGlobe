import React, {Component} from "react"

import {withStyles, Grid, ListItemIcon} from "@material-ui/core"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import config from "../../config";

import styles from "../../assets/jss/components/commentsStyle"

// import comments from "../../assets/data/CommentData"
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import RegularButton from "../CustomButtons/RegularButton"
import {commentsService} from "../../services/commentsService";
import deleteCommentButtonIcon from "../../assets/img/close-24px.svg"
import Icon from "@material-ui/core/Icon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Spinner from 'react-spinner-material';

class Comments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: "",
            dialogBoxOpened: false,
            selectedCommentId: 0,
            postLoading: false,
            comments: [],
            deletedComments: []
        }

        this.handleFormChange = this.handleFormChange.bind(this)
        this.post = this.post.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
        this.renderConfirmDialog = this.renderConfirmDialog.bind(this)
    }

    componentDidMount() {
        setInterval(() => {
            commentsService.getComments(this.props.projectId)
                .then(c => c.json())
                .then(json => {
                    console.log(json)
                    this.setState({
                        comments: json.comments.filter(comment => !this.state.deletedComments.includes(comment.commentId))
                    })
                }).catch(err => console.log(err));
        }, 3000)
    }


    handleFormChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    post() {
        this.setState({postLoading: true});
        const today = new Date()
        this.setState({
            date: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
        });

        commentsService.postComment(this.props.projectId, this.state)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                let found = false;
                for (let i = 0; i < this.state.comments.length; i++) {
                    if (this.state.comments[i].commentId === response.comment.commentId) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.setState(() => {
                        const updated_comments = this.state.comments.concat(response.comment);
                        return {
                            comments: updated_comments,
                            postLoading: false
                        }
                    })
                } else {
                    this.setState({postLoading: false})
                }
            })
            .catch(err => console.log(err))
    }

    deleteComment(commentId) {
        this.setState(() => {
            const updatedDeletedComments = this.state.deletedComments.concat(commentId);
            return {
                deletedComments: updatedDeletedComments,
                comments: this.state.comments.filter(comment => comment.commentId !== commentId)
            }})
        commentsService.deleteComment(commentId)
            .then(response => {
                this.setState({
                    deletedComments: this.state.deletedComments.filter(id => id !== commentId)
                })
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })

    }

    renderConfirmDialog() {
        return (<Dialog
            open={this.state.dialogBoxOpened}
            onClose={() => {
                this.setState({dialogBoxOpened: false})
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete comment?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this comment?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    this.setState({dialogBoxOpened: false})
                }} color="primary">
                    No
                </Button>
                <Button onClick={() => {
                    this.deleteComment(this.state.selectedCommentId);
                    this.setState({dialogBoxOpened: false})
                }} color="primary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>);
    }

    render() {
        const {classes} = this.props
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
                                    <img src={deleteCommentButtonIcon}
                                         onClick={() => {
                                             this.setState({
                                                 selectedCommentId: comment.commentId,
                                                 dialogBoxOpened: true
                                             });
                                         }
                                         }
                                         style={{cursor: 'pointer'}}/>
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
                        disabled={this.state.postLoading}
                    >
                        {this.state.postLoading ?  <Spinner size={20} spinnerColor={"#FFFFFF"} spinnerWidth={3} visible={true} /> : "Post"}
                    </RegularButton>
                </div>
                {this.renderConfirmDialog()}
            </div>
        )
    }
}

export default withStyles(styles)(Comments)