import React, { Component } from "react"

import { withStyles } from "@material-ui/styles"

import styles from "../../assets/jss/views/proposalPageStyle"
import cardData from "../../assets/data/ProjectData"

class ProposalPage extends Component {
    render() {
        const { classes } = this.props
        const data = cardData[0]
        return (
            <div>
                <div className={classes.container}>
                    <h1>{data.title}</h1>
                </div>
                <div className={classes.container}>
                    <h2>{data.organisation}</h2>
                </div>
                <div className={classes.container}>
                    <img src={data.organisationLogo}/>
                </div>
                <div className={classes.container}>
                    <h3>{data.status}</h3>
                </div>
                <div className={classes.container}>
                    <h4>{data.location}</h4>
                </div>
                <div className={classes.container}>
                    <p>{data.detailedDescription}</p>
                </div>
                {data.images.map(image => (
                    <div className={classes.container}>
                        <img 
                            src={image} 
                            style={{ 
                                height: "80%", 
                                width: "80%", 
                                display: "block", 
                                objectFit: "cover", 
                                marginBottom: "40px"
                            }}
                        />
                    </div>
                ))}
            </div>
        )
    }
}

export default withStyles(styles)(ProposalPage)