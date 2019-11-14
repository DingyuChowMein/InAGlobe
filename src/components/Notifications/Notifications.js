import React, { Component, Fragment } from "react"

import { 
    withStyles,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography
} from "@material-ui/core"
import NotificationsIcon from '@material-ui/icons/Notifications'

import CardsList from "../CardsList/CardsList"
import timeDiff from "../../utils/DynamicTimeDiff"

import styles from "../../assets/jss/components/notificationsStyle"

class Notifications extends Component {

    render() {
        const { classes, notifyList, title } = this.props
        const contentStruct = (card) => {
            return (
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt="Profile Picture"
                            src={card.profilePic}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Fragment>
                                <b>
                                    {card.userName}
                                </b>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.timeDiff}
                                >
                                    {timeDiff(new Date(card.date))}
                                </Typography>
                            </Fragment>
                        }
                        secondary={
                            <Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    {card.projectName}
                                </Typography>
                                <br/>
                                {card.details}
                            </Fragment>
                        }
                    />
                </ListItem>
            )
        }

        return (
            <CardsList 
                cardData={notifyList} 
                title={title} 
                contentStruct={contentStruct}
                EmptyIcon={NotificationsIcon}
                emptyText="All Caught Up!"
            />
        )
    }
}

export default withStyles(styles)(Notifications)