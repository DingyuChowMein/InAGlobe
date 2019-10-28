// Main ReactJS libraries
import React, { Component } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

// Material UI libraries
import { withStyles } from "@material-ui/core"

// Importing class's stylesheet
import styles from "../../assets/jss/components/cardStyle"

class Card extends Component {
    render() {
        const { classes, className, children, plain, profile, chart, ...rest } = this.props
        const cardClasses = classNames({
            [classes.card]: true,
            [classes.cardPlain]: plain,
            [classes.cardProfile]: profile,
            [classes.cardChart]: chart,
            [className]: className !== undefined
        })
        return (
            <div className={cardClasses} {...rest}>
                {children}
            </div>
        )
    }
}

Card.propTypes = {
    className: PropTypes.string,
    plain: PropTypes.bool,
    profile: PropTypes.bool,
    chart: PropTypes.bool,
    children: PropTypes.node
}

export default withStyles(styles)(Card)
