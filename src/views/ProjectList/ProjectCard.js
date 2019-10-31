// Main ReactJS libraries
import React, { Component } from "react"
import { Switch, Redirect, withRouter } from "react-router-dom"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Imports of different components in project
import Button from "../../components/CustomButtons/RegularButton"
import Card from "../../components/Card/Card"
import CardBody from "../../components/Card/CardBody"

// Import class's stylesheet
import styles from "../../assets/jss/views/projectCardStyle"

class ProjectCard extends Component {
    constructor(props) {
        super(props)
        this.openProposalPage = this.openProposalPage.bind(this)
    }

    openProposalPage() {
        const dataValue = JSON.stringify(this.props.data)
        localStorage.setItem("proposalPage", dataValue)
        console.log(dataValue)
        return (
            <Redirect from="/main/projectlist" to="/main/projectlist/proposalpage" />
        )
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
            <Card>
                <img
                    className={classes.cardImgTop}
                    alt="Provided for a Card."
                    src={images[0]}
                    data-holder-rendered="true"
                />
                <CardBody>
                    <h3 className={classes.h3}>{title}</h3>
                    <h4 className={classes.h4}>{organisation}</h4>
                    <h5 className={classes.h5}>{status}</h5>
                    <p>{shortDescription}</p>
                    <div className={classes.buttonDiv}>
                        <Button 
                            color="primary" 
                            className={classes.learnMoreButton}
                            onClick={this.openProposalPage}
                        >
                            Learn More
                        </Button>
                        <Button 
                            color="primary" 
                            className={classes.selectProposalButton}
                        >
                            Select Proposal
                        </Button>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

export default withRouter(withStyles(styles)(ProjectCard))