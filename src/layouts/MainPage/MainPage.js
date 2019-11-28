// Main ReactJS libraries
import React, {Component} from "react"
import {Switch, Route, Redirect} from "react-router-dom"

// Material UI libraries
import {withStyles} from "@material-ui/styles"

// Importing webpath data for logins
import {mainRoutes} from "../../routes"
import {checkpointRoutes} from "../../routes"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/mainPageStyle"
import {PrivateRoute} from "../../helpers/PrivateRoute";
import {projectService} from "../../services/projectsService";

// Importing helper or service functions
import {EventSourcePolyfill} from "event-source-polyfill";
import config from "../../config";


class MainPage extends Component {

    constructor(props) {
        super(props);
        this.getProjectList();
        this.state = {
            projects: [],
            '/home': {
                needApproval: []
            },

            '/projectlist': [],
            '/proposalpage/:id': []
        };
        this.getProjectList = this.getProjectList.bind(this);
        this.handleProjectUpdates = this.handleProjectUpdates.bind(this);
        this.eventSource = new EventSourcePolyfill(config.apiUrl + '/project-stream/', {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
            }
        });
    }

    componentDidMount() {
        this.eventSource.addEventListener('project-stream', json => this.handleProjectUpdates(json));
        this.eventSource.addEventListener('error', (err) => {console.log(err)});
    };

    componentWillUnmount() {
        this.eventSource.removeEventListener('project-stream', json => this.handleProjectUpdates(json));
        this.eventSource.removeEventListener('error', (err) => {console.log(err)});
        this.eventSource.close();
    };

    handleProjectUpdates(json) {
        const v = JSON.parse(json.data);
        console.log(v.project);
        if (v.message === 'Project added to db!'){
            console.log(v.project);
            this.setState({
                ['/projectlist']: this.state['/projectlist'].concat(v.project)
            })
        }
        else if (v.message === 'Project updated!'
            || v.message === 'Project approved!'
            || v.message === 'Project disapproved') {
            const array = [...this.state['/projectlist']];
            const index = array.findIndex(function(item){
                return item.id === v.project.id;
            });
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({
                    ['/projectlist']: array,
                    ['/proposalpage/:id']: array
                });
            }
        }

        this.setState({
            ['/home']: { needApproval: this.state.projects.filter(project => project.status === "Needs Approval") }
        });
    };

    getProjectList = () => {
        projectService.getProjects()
            .then(data => {
                console.log(data);
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects,
                    ['/home']: {
                        needApproval: data.projects.filter(project => project.status === "Needs Approval")
                    },
                    ['/projectlist']:  data.projects,
                    ['/proposalpage/:id']:  data.projects
                })
            })
            .catch(console.log);
    };

    render() {
        return (
            <Switch>
                {mainRoutes.map((prop, key) => {
                    return (
                        <PrivateRoute
                            path={prop.layout + prop.path}
                            key={key}
                            exact
                            component={prop.component}
                            data={this.state[prop.path]}
                        />
                    )
                })}
                <Redirect strict from="/main" to="/main/home"/>
            </Switch>
        )
    }
}

export default withStyles(styles)(MainPage)