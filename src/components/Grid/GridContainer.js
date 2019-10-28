// Main ReactJS libraries
import React, { Component } from "react"
import PropTypes from "prop-types"

// Material UI libraries
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"

// Importing class's stylesheet
import styles from "../../assets/jss/components/gridContainerStyle"

class GridContainer extends Component {
    render() {
        const { classes, children, ...rest } = this.props
        return (
            <Grid container {...rest} className={classes.grid}>
                {children}
            </Grid>
        )
    }
}

GridContainer.propTypes = {
    children: PropTypes.node
}

export default withStyles(styles)(GridContainer)