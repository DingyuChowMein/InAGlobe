import React, { Component } from "react"

import { withStyles } from "@material-ui/styles"

import styles from "../../assets/jss/views/proposalPageStyle"
import config from "../../config";

class ProposalPage extends Component {
    render() {
        const { classes, data, children, isPreview } = this.props

        return (
            <div>
                <div className={classes.container}>
                    <h1>{data.title}</h1>
                </div>
                <div className={classes.container}>
                    <h2>{data.organisation}</h2>
                </div>
                {data.images.map(image => (
                    <div className={classes.imagesContainer}>
                        <img
                            alt={data.title}
                            src={isPreview ? URL.createObjectURL(image) : config.s3Bucket + image}
                            className={classes.projectImages}
                        />
                    </div>
                ))}
                <div className={classes.container}>
                    <h3>{data.status}</h3>
                </div>
                <div className={classes.container}>
                    <h4>{data.location}</h4>
                </div>
                <div className={classes.container}>
                    <h5>{data.detailedDescription}</h5>
                </div>
                <div className={classes.container}>
                    {data.documents.map(doc => (
                        <a href={isPreview ? URL.createObjectURL(doc) : config.s3Bucket + doc}>
                            {isPreview ? doc["name"] : doc}{"\n"}
                        </a>
                    ))}
                </div>

                {children}
            </div>
        )
    }
}

export default withStyles(styles)(ProposalPage)