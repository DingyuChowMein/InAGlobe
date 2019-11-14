import React, { Component, Fragment } from "react"

import { 
    withStyles,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography
} from "@material-ui/core"

import CardsList from "../CardsList/CardsList"
import timeDiff from "../../utils/DynamicTimeDiff"

import styles from "../../assets/jss/components/notificationsStyle"
import Button from "@material-ui/core/Button";

class Notifications extends Component {

    render() {
        const { classes, notifyList, title, approveFunction} = this.props
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
                                {card.userName}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.timeDiff}
                                >
                                    {timeDiff(card.date)}
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
                                {` — ${card.details}`}
                            </Fragment>
                        }
                    />
                    <Button onClick={() => approveFunction(card.projectId, card.userId, card.notifyId)}>Approve</Button>
                </ListItem>
            )
        }

        return (
            <CardsList cardData={notifyList} title={title} contentStruct={contentStruct}/>
        )
    }
}

export default withStyles(styles)(Notifications)