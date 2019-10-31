import React, { Component } from "react"

import { withStyles, Grid } from "@material-ui/core"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

import styles from "../../assets/jss/components/commentsStyle"

import comments from "../../assets/data/CommentData"
import RegularButton from "../CustomButtons/RegularButton"

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
        })
        var bearer = 'Bearer ' + localStorage.getItem('token')
        console.log(bearer)
        console.log(this.state)

        fetch(config.apiUrl + `/comments/${this.state.projectId}/`, {
            method: 'post',
            headers: {
                'Authorization': bearer,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(response => {
            // Redirect here based on response
            console.log(response)
            location.reload()
        }).catch(err => console.log(err))
    }

    render() {
        const { classes } = this.props
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
                                    primary={comment.ownerName}
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
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
                </List>
                <Grid container spacing={3}>
                    <Grid item xs={11}>
                        <TextField
                            id="outlined-bare"
                            className={classes.textField}
                            placeholder="Enter your comment here..."
                            margin="normal"
                            variant="outlined"
                            inputProps={{ 
                                'aria-label': 'bare',
                                onChange: this.handleFormChange
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <RegularButton 
                            color="primary" 
                            className={classes.postButton}
                            onClick={this.post}
                        >
                            {"Post"}
                        </RegularButton>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Comments)