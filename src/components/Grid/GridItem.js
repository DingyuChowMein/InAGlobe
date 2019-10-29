// Main ReactJS libraries
import React, { Component } from "react"
import PropTypes from "prop-types"

// Material UI libraries
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/styles"

// Importing class's stylesheet
import styles from "../../assets/jss/components/gridItemStyle"

class GridItem extends Component {
    render() {
        const { classes, children, ...rest } = this.props
        return (
            <Grid item {...rest} className={classes.grid}>
                {children}
            </Grid>
        )
    }
}

GridItem.propTypes = {
    children: PropTypes.node
}

export default withStyles(styles)(GridItem)
