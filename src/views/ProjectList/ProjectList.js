// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles, Grid } from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectCard from "./ProjectCard"

// Importing helper or service functions
import config from '../../config'
import { projectService } from "../../services/projectsService"

// import { EventSourcePolyfill } from 'event-source-polyfill';


// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: []
        };
        // this.eventSource = new EventSourcePolyfill(config.apiUrl + '/project-stream/', {
        //     headers: {
        //         'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        //     }
        // });
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
            .catch(console.log);
        // this.eventSource.addEventListener('project-stream', (json) => {
        //     const v = JSON.parse(json.data);
        //     if (v.message === 'Project added to db!'){
        //         this.setState({
        //             projects: this.state.projects.concat(v.project)
        //         })
        //     }
        //     else if (v.message === 'Project updated!'){
        //
        //     }
        //     else if (v.message === 'Project approved!'){
        //
        //     }
        //     else if (v.message === 'Project disapproved!'){
        //
        //     }
        //     else if (v.message === 'Project deleted!'){
        //
        //     }
        // });
        // this.eventSource.addEventListener('error', (err) => {console.log(err)})
    }

    render() {
        const {classes} = this.props
        return (
            <ResponsiveDrawer name={"Project List"}>
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        {this.state.projects.map(card => (
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
