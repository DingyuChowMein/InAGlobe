// Main ReactJS libraries
import React, { Component } from "react"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Imports of different components in project
import Button from "../../components/CustomButtons/RegularButton"
import Card from "../../components/Card/Card"
import CardBody from "../../components/Card/CardBody"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"

class ProjectCard extends Component {
    render() {
        const { classes } = this.props
        const {
            title, 
            organisation, 
            status, 
            shortDescription, 
            images } = this.props.data
    
        return (
            <Card>
                <img
                    className={classes.cardImgTop}
                    alt="Provided for a Card."
                    style={{ height: "180px", width: "100%", display: "block", objectFit: "cover" }}
                    src={images[0]}
                    data-holder-rendered="true"
                />
                <CardBody>
                    <h3 className={classes.h3}>{title}</h3>
                    <h4 className={classes.h4}>{organisation}</h4>
                    <h5 className={classes.h5}>{status}</h5>
                    <p>{shortDescription}</p>
                    <div>
                        <Button color="primary" style={{ marginRight: "10px" }}>{"Learn More"}</Button>
                        <Button color="primary">{"Select Proposal"}</Button>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default withStyles(styles)(ProjectCard)