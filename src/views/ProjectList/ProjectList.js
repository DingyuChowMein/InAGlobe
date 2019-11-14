// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles} from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import GridContainer from "../../components/Grid/GridContainer"
import GridItem from "../../components/Grid/GridItem"
import ProjectCard from "./ProjectCard"

// Importing example card data
// import cardData from "../../assets/data/ProjectData"

// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"
import config from '../../config'
import {projectService} from "../../services/projectsService";

class ProjectList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projects: []
        }
    }

    componentDidMount() {
        projectService.getProjects()
            .then(data => {
                console.log(data);
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects
                })
            })
            .catch(console.log)
    }

    render() {
        const {classes} = this.props
        return (
            <ResponsiveDrawer name={"Project List"}>
                <div className={classes.root}>
                    <GridContainer spacing={2}>
                        {this.state.projects.map(card => (
                            <GridItem xs={12} sm={12} md={6} key={card.id}>
                                <ProjectCard data={card}/>
                            </GridItem>
                        ))}
                    </GridContainer>
                </div>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProjectList)
