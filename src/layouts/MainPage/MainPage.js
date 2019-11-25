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


class MainPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            '/projectlist': {
                data: [],
                refresh: this.getProjectList
            }
        }
    }

    componentDidMount() {
        this.getProjectList()
    }

    getProjectList = () => {
        projectService.getProjects()
            .then(data => {
                console.log(data);
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    ['/projectlist']: {
                        data: data.projects,
                        refresh: this.getProjectList
                    }
                })
            })
            .catch(console.log);
    };

    render() {
        const {path} = this.props.match;

        // mainRoutes.map((prop, key) => console.log(prop.path + this.state[prop.path]));
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