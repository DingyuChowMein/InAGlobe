// Main ReactJS libraries
import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router-dom"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Importing webpath data for logins
import { mainRoutes } from "../../routes"
import { checkpointRoutes } from "../../routes"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/mainPageStyle"
import {PrivateRoute} from "../../helpers/PrivateRoute";


class MainPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const { path } = this.props.match;

        return (
            <Switch>
                {mainRoutes.map((prop, key) => {
                    return (
                        <PrivateRoute
                            path={prop.layout + prop.path}
                            key={key}
                            exact
                            component={prop.component}
                        />
                    )
                })}
                <Redirect strict from="/main" to="/main/home" />
            </Switch>
        )
    }
}

export default withStyles(styles)(MainPage)