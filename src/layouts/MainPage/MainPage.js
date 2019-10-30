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
        const { path } = this.props.match
        return (
            <Switch>
                {drawerRoutes.map((prop, key) => {
                    return (
                        <Route 
                            path={path + prop.path}
                            key={key}
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