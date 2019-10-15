import React from "react"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"

// core components
import Button from "../../components/CustomButtons/Button.js"
import Card from "../../components/Card/Card.js"
import CardBody from "../../components/Card/CardBody.js"

import styles from "../../assets/jss/material-dashboard-react/cardImagesStyles.js"

const useStyles = makeStyles(styles)

export default function ProjectCard(props) {
    
    const classes = useStyles()
    const { title, organisation, status, description, image } = props
    return (
        <Card>
            <img
                className={classes.cardImgTop}
                alt="Provided for a Card."
                style={{ height: "180px", width: "100%", display: "block", objectFit: "cover" }}
                src={image}
                data-holder-rendered="true"
            />
            <CardBody>
                <h3>{title}</h3>
                <h4>{organisation}</h4>
                <h5>{status}</h5>
                <p>{description}</p>
                <Button color="primary" style={{ marginRight: "10px" }}>{"Learn More"}</Button>
                <Button color="primary">{"Select Proposal"}</Button>
            </CardBody>
        </Card>
    )
}