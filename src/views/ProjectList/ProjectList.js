import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import ProjectCard from "views/ProjectList/ProjectCard"

import pillPicture from "assets/img/card_example1.png"
import smokePicture from "assets/img/card_example2.png"

const useStyles = makeStyles(theme => ({
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
}))

const cardData = [
    {
        title: "Pill Organiser for Self-Medication",
        organisation: "Fundacion Mozambique Sur",
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
    }
]

export default function ProjectList() {
    const classes = useStyles()
    return (
        <div class="row">
            {cardData.map(card => (
                <div class="col s12">
                    <ProjectCard 
                        title={card.title}
                        organisation={card.organisation}
                        status={card.status}
                        description={card.description}
                        image={card.image}
                    />
                </div>
            ))}
        </div>
    )
}