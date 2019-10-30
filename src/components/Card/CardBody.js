// Main ReactJS libraries
import React, { Component } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Importing class's stylesheet
import styles from "../../assets/jss/components/cardBodyStyle"

class CardBody extends Component {
    render() {
        const { classes, className, children, plain, profile, ...rest } = this.props
        const cardBodyClasses = classNames({
            [classes.cardBody]: true,
            [classes.cardBodyPlain]: plain,
            [classes.cardBodyProfile]: profile,
            [className]: className !== undefined
        })
        return (
            <div className={cardBodyClasses} {...rest}>
                {children}
            </div>
        )
    }
}

CardBody.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  children: PropTypes.node
}

export default withStyles(styles)(CardBody)
