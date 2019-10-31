import React, { Component } from "react"
import { FixedSizeList } from "react-window"

import { withStyles } from "@material-ui/core"
// import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import styles from "../../assets/jss/components/commentsStyle"

// import comments from "../../assets/data/CommentData"

class Comment extends Component {
    render() {
        const { data, index, style } = this.props

        return (
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar 
                            alt="Profile Picture" 
                            src="https://picsum.photos/128"
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={data[index].ownerFirstName + " " + data[index].ownerLastName}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={style.inline}
                                    color="textPrimary"
                                >
                                    {data[index].date}
                                </Typography>
                                {` — ${data[index].text}`}
                            </React.Fragment>
                        }
                    />
                    {/* <Divider variant="inset" component="li" /> */}
                </ListItem> 
        )
    }
}

class Comments extends Component {

    render() {
        const { classes, comments } = this.props
        console.log("Comments component");
        console.log(comments);
        return (
            <FixedSizeList 
                height={500}
                itemSize={46} 
                itemCount={comments.length}
                itemData={comments}
                onScroll={this.handleScroll}
                className={classes.root}

            >
                {withStyles(styles)(Comment)}
            </FixedSizeList>
        )
    }
}

export default withStyles(styles)(Comments)