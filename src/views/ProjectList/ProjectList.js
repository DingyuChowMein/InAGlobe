// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles, Grid} from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectCard from "./ProjectCard"

// Importing helper or service functions
import { projectService } from "../../services/projectsService"
import { EventSourcePolyfill } from 'event-source-polyfill';
import config from "../../config.js"


// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"

class ProjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: this.props.data
        };
        // this.eventSource = new EventSourcePolyfill(config.apiUrl + '/project-stream/', {
        //     headers: {
        //         'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
        //     }
        // });
        this.handleProjectUpdates = this.handleProjectUpdates.bind(this);
    }

    componentDidMount() {
        // projectService.getProjects()
        //     .then(data => {
        //         console.log(data);
        //         data.projects.forEach(project =>
        //             project.status = (project.status === 0 ? "Needs Approval" : "Approved"));
        //         this.setState({
        //             projects: data.projects
        //         });
        //     })
        //     .catch(console.log);
        // console.log(this.state.projects);
        this.props.refresh();
        // this.eventSource.addEventListener('project-stream', json => this.handleProjectUpdates(json));
        // this.eventSource.addEventListener('error', (err) => {console.log(err)});
    }

    componentWillUnmount() {
        // this.eventSource.removeEventListener('project-stream', json => this.handleProjectUpdates(json));
        // this.eventSource.removeEventListener('error', (err) => {console.log(err)});
        // this.eventSource.close();
    }

    handleProjectUpdates(json) {
        const v = JSON.parse(json.data);
        console.log(v.project);
        if (v.message === 'Project added to db!'){
            console.log(v.project.projects[0]);
            this.setState({
                projects: this.state.projects.concat(v.project.projects[0])
            })
        }
        else if (v.message === 'Project updated!'){
            const array = [...this.state.projects];
            const index = array.findIndex(function(item){
                return item.id === v.project.id;
            });
            if (index !== -1) {
                Object.keys(v.project).forEach((key) => {
                    array[index][key] = v.project[key];
                });
                this.setState({
                    projects: array
                });
            }
        }
        else if (v.message === 'Project approved!'){

        }
        else if (v.message === 'Project disapproved!'){

        }
        else if (v.message === 'Project deleted!'){
            const array = [...this.state.projects];
            const index = array.findIndex(function(item){
                return item.id === v.project.id;
            });
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({
                    projects: array
                });
            }
        }
    }

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
