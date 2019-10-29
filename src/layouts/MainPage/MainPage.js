// Main ReactJS libraries
import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router-dom"

// Material UI libraries
import { withStyles } from "@material-ui/styles"

// Importing webpath data for logins
import { drawerRoutes } from "../../routes"

// Importing class's stylesheet
import styles from "../../assets/jss/layouts/mainPageStyle"

class MainPage extends Component {
    render() {
        return (
            <Switch>
                {drawerRoutes.map((prop, key) => {
                    if (prop.layout === "/main") {
                        return (
                            <Route 
                                path={prop.layout + prop.path}
                                component={prop.component}
                                key={key}
                            />
                        )
                    }
                    return null
                })}
                <Redirect from="/main" to="/main/home" />
            </Switch>
        )
    }
}

export default withStyles(styles)(MainPage)