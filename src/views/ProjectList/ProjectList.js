import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import ProjectCard from "./ProjectCard.js"

import cardData from "../../data/ExampleCards.js"

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js"
import GridContainer from "../../components/Grid/GridContainer.js"
import GridItem from "../../components/Grid/GridItem.js"

const useStyles = makeStyles(styles)

export default function ProjectList() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <GridContainer spacing={2}>
                {cardData.map(card => (
                    <GridItem xs={12} sm={12} md={6}>
                        <ProjectCard 
                            title={card.title}
                            organisation={card.organisation}
                            status={card.status}
                            description={card.shortDescription}
                            image={card.images[0]}
                        />
                    </GridItem>
                ))}
            </GridContainer>
        </div>
    )
}