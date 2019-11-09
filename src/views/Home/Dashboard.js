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
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "../../components/Card/Card";

class Dashboard extends Component {
    constructor(props){
        super(props);

        this.joinRequestClicked = this.joinRequestClicked.bind(this);

        this.state = {
            user: {},
            projects: [],
            requests: [],
        }

    }

    joinRequestClicked(event) {
        console.log(event.target)
        alert("Request approved." + event.target.value);
    }

    componentDidMount() {
        this.setState({
            user: localStorage.getItem('user'),
        });

        var token = localStorage.getItem('token')
        var bearer = 'Bearer ' + token

        fetch(config.apiUrl + '/dashboard/', {
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

        fetch(config.apiUrl + '/joiningApprove/', {
            method: 'get',
            headers: {
                'Authorization': bearer
            },
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    requests: data.requests
                })
                console.log(data.requests)
            })
            .catch(console.log)
    }

    render() {
      const { classes } = this.props
        return (
            <>
            <ResponsiveDrawer name={"Dashboard"}>
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
            <Paper style={{maxHeight: 200, overflow: 'auto'}}>
                 <List>
                    {this.state.requests.map((request, i) => (
                        <Card containerStyle={{width:"100%"}}>
                            <ListItem selectable="true" onClick={this.joinRequestClicked}>
                                value={i}
                                primaryText={request.project_id + " " + request.user_id}
                            </ListItem>
                        </Card>
                    ))}
                </List>
            </Paper>
            </>
        )
    }
}

export default withStyles(styles)(Dashboard)
