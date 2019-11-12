import React, { Component, Fragment } from "react"
import PerfectScrollbar from 'react-perfect-scrollbar'

import { 
    withStyles, 
    Card, 
    GridList,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography
} from "@material-ui/core"

import styles from "../../assets/jss/components/notificationsStyle"
import 'react-perfect-scrollbar/dist/css/styles.css'

class Notifications extends Component {

    render() {
        const { classes, notifyList, title } = this.props
        return (
            <div>
                <h3 style={{ marginBlockStart: "0" }}>{title}</h3>
                <PerfectScrollbar component="div" style={{ maxHeight: "300px", paddingRight: "20px" }}>
                    <List>
                        {notifyList.map((notification, key) => (
                            <Card key={key} style={{ marginBottom: "10px" }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar
                                            alt="Profile Picture"
                                            src={notification.profilePic}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`Owner: ${notification.userName} Project: ${notification.projectName}`}
                                        secondary={
                                            <Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="textPrimary"
                                                >
                                                    {notification.date}
                                                </Typography>
                                                {` — ${notification.details}`}
                                            </Fragment>
                                        }
                                    />
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </PerfectScrollbar>
            </div>
        )
    }
}

export default withStyles(styles)(Notifications)