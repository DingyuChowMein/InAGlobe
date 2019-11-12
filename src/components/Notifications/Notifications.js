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
                </ListItem>
            )
        }

        return (
            <CardsList cardData={notifyList} title={title} contentStruct={contentStruct}/>
        )
    }
}

export default withStyles(styles)(Notifications)