// Main ReactJS libraries
import React, { Component } from "react"
import { withRouter } from "react-router-dom"

// Material UI libraries
import { 
    withStyles, 
    Card, 
    CardContent, 
    CardActions,
} from "@material-ui/core"

// Imports of different components in project
import RegularButton from "../../components/CustomButtons/RegularButton"

import config from "../../config"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"

class ProjectCard extends Component {
    constructor(props) {
        super(props)
        this.openProposalPage = this.openProposalPage.bind(this)
    }

    openProposalPage() {
        const dataValue = JSON.stringify(this.props.data)
        localStorage.setItem(`proposalPage/${this.props.data.id}`, dataValue)
        this.props.history.push(`/main/projectlist/proposalpage/${this.props.data.id}`)
    }

    render() {
        const { classes } = this.props
        const {
            title,
            organisation,
            status,
            shortDescription,
            images } = this.props.data

        return (
            <Card className={classes.cardDiv}>
                <img
                    className={classes.cardImgTop}
                    alt="Provided for a Card."
                    src={config.s3Bucket + images[0]}
                />
                <CardContent>
                    <h3>{title}</h3>
                    <h4>{organisation}</h4>
                    <h5>{status}</h5>
                    <p>{shortDescription}</p>
                </CardContent>
                <CardActions className={classes.buttonDiv}>
                    <RegularButton
                        color="primary"
                        className={classes.learnMoreButton}
                        onClick={this.openProposalPage}
                    >
                        Learn More
                    </RegularButton>
                </CardActions>
            </Card>
        )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))
