import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    }
}

const cardData = [
    {
        title: "Something",
        organisation: "",
        progress: ""
    }
]

const useStyles = makeStyles(styles)

export default function ProjectList() {
    const classes = useStyles()
    return (
        <div class="row">

        </div>
    )
}