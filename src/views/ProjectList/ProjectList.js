import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import ProjectCard from "./ProjectCard.js"

import pillPicture from "../../assets/img/card_example1.png"
import smokePicture from "../../assets/img/card_example2.png"
import emissionPicture from "../../assets/img/card_example3.png"
import mobilePicture from "../../assets/img/card_example4.png"

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js"
import GridContainer from "../../components/Grid/GridContainer.js"
import GridItem from "../../components/Grid/GridItem.js"

const useStyles = makeStyles(styles)

const cardData = [
    {
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundaćion Mozambique Sur",
        status: "Adopted (Department of Bioengineering)",
        description: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
        image: pillPicture
    },
    {
        title: "Low-Smoke Cooking Environment",
        organisation: "Helvetas Swiss Intercooperation",
        status: "Adopted (Engineering Change)",
        description: "Develop a low-cost stove that produced little or no smoke; or an efficient extractor system that can be coupled to current cooking methods.",
        image: smokePicture
    },
    {
        title: "Low Emission Cashew Nut Processor",
        organisation: "Helvetas Swiss Intercooperation",
        status: "Adopted (Engineering Change)",
        description: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
        image: emissionPicture
    },
    {
        title: "Mobile Grain Network-Marketplace",
        organisation: "Helvetas Swiss Intercooperation",
        status: "Unadopted",
        description: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
        image: mobilePicture
    }
]

export default function ProjectList() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <GridContainer spacing={2}>
                {cardData.map(card => (
                    <GridItem xs={12}>
                        <ProjectCard 
                            title={card.title}
                            organisation={card.organisation}
                            status={card.status}
                            description={card.description}
                            image={card.image}
                        />
                    </GridItem>
                ))}
            </GridContainer>
        </div>
    )
}