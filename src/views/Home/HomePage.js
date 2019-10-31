// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/styles'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing class's stylesheet
import styles from "../../assets/jss/views/homePageStyle"

import GridContainer from "../../components/Grid/GridContainer"
import GridItem from "../../components/Grid/GridItem"
import ProjectCard from "../ProjectList/ProjectCard"
import config from '../../config'

class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: {},
            projects: [],
        }

    }

    componentDidMount() {
        this.setState({
            user: localStorage.getItem('user'),
        });

        var token = localStorage.getItem('token')
        var bearer = 'Bearer ' + token

        fetch(config.apiUrl + '/projects/', {
            method: 'get',
            headers: {
                'Authorization': bearer
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects
                })
            })
            .catch(console.log)
    }

    render() {
      const { classes } = this.props
        return (
            <ResponsiveDrawer name={"Dashboard"}>
              <div className={classes.root}>
                  <GridContainer spacing={2}>
                      {this.state.projects.map(card => (
                          <GridItem xs={12} sm={12} md={6} key={card.id}>
                              <ProjectCard data={card}/>
                          </GridItem>
                      ))} :
                  </GridContainer>
              </div>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(HomePage)
