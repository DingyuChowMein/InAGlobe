import React, { Component } from "react"

import { withStyles } from "@material-ui/styles"

import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer"

import styles from "../../assets/jss/views/proposalPageStyle"
import config from "../../config";

class ProposalPage extends Component {
    render() {
        const { classes, data, children } = this.props
        return (
            <ResponsiveDrawer name={"Proposal Page"}>
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
                            src={config.s3Bucket+image}
                            className={classes.projectImages}
                        />
                    </div>
                ))}
                {/*<div className={classes.imagesContainer}>*/}
                    {/*<img */}
                        {/*alt={data.organisation} */}
                        {/*src={data.organisationLogo}*/}
                        {/*className={classes.projectImages}/>*/}
                {/*</div>*/}
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
                        <a href={config.s3Bucket+doc}>{doc}{"\n"}</a>
                    ))}
                </div>

                {children}
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProposalPage)