// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles, Grid} from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectCard from "./ProjectCard"

// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"

class ProjectList extends Component {
    render() {
        const {classes} = this.props;
        return (
            <ResponsiveDrawer name={"Project List"}>
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        {this.props.data.map(card => (
                            <Grid item xs={12} sm={12} md={6} key={card.id}>
                                <ProjectCard data={card}/>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProjectList)
