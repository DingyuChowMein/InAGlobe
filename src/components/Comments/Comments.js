import React, {Component} from "react"

import {withStyles, Grid} from "@material-ui/core"
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
import RegularButton from "../CustomButtons/RegularButton"
import {commentsService} from "../../services/commentsService";

class Comments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: ""
        }
        this.handleFormChange = this.handleFormChange.bind(this)
        this.post = this.post.bind(this)
    }

    handleFormChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    post() {
        const today = new Date()
        this.setState({
            date: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
        });

        commentsService.postComment()
            .then(response => {
                // Redirect here based on response
                console.log(response)
                window.location.reload()
            }).catch(err => console.log(err))
    }

    render() {
        const {classes, comments} = this.props
        return (
            <div className={classes.root}>
                <List>
                    {comments.map(comment => (
                        <div className={classes.root}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar
                                        alt="Profile Picture"
                                        src="https://picsum.photos/128"
                                    />
                                </ListItemAvatar>
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
            </div>
        )
    }
}

export default withStyles(styles)(Comments)