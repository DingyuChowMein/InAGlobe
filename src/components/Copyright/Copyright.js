// Main ReactJS libraries
import React, { Component } from "react"

// Material UI libraries
import Typography from "@material-ui/core/Typography"
import Link from '@material-ui/core/Link'

class Copyright extends Component {

    render() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://www.inaglobe.com">
				    InAGlobe Education
			    </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        )
    }
    
}

export default Copyright