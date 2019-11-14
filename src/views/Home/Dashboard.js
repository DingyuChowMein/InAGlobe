// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles, Grid} from '@material-ui/core'

// Imports of different components in project
import CardScrollView from '../../components/ScrollView/CardScrollView'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import Notifications from '../../components/Notifications/Notifications'

// Importing class's stylesheet
import styles from "../../assets/jss/views/homePageStyle"

// import GridContainer from "../../components/Grid/GridContainer"
// import GridItem from "../../components/Grid/GridItem"
// import ProjectCard from "../ProjectList/ProjectCard"
import config from '../../config'
import data from "../../assets/data/ProjectData"
import notifications from "../../assets/data/NotificationData"
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {dashboardService} from "../../services/dashboardService";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.joinRequestClicked = this.joinRequestClicked.bind(this);
        this.renderRequestsList = this.renderRequestsList.bind(this);

        this.state = {
            user: {},
            projects: [],
            requests: [],
            userType: JSON.parse(localStorage.getItem('user')).permissions
        }

    }

    joinRequestClicked(project_id, user_id, index) {
        var token = JSON.parse(localStorage.getItem('user')).token;
        var bearer = 'Bearer ' + token

        fetch(config.apiUrl + `/joiningApprove/`, {
            method: 'post',
            headers: {
                'Authorization': bearer,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userId: user_id,
                projectId: project_id
            })
        }).then(response => {
            // Redirect here based on response
            console.log(response)
            alert("Request approved.")
            this.setState({
                requests: this.state.requests.filter((_, i) => i !== index)
            });
        }).catch(err => console.log(err))
    }

    componentDidMount() {
        this.setState({
            user: localStorage.getItem('user'),
        });

        var token = JSON.parse(localStorage.getItem('user')).token;
        var bearer = 'Bearer ' + token;

        dashboardService.getDashboard()
            .then(data => {
                console.log(data)
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects
                })
            })
            .catch(console.log)

        // Get the list of project join requests
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

    renderRequestsList() {
        if (this.state.userType !== 0) {
            return;
        }
        return (
            <div>
                <Typography gutterBottom variant="h5" component="h2"> List of project join requests </Typography>
                <Paper style={{maxHeight: 200, overflow: 'auto'}}>
                    <List>
                        {this.state.requests.map((request, i) => (
                            <ListItem
                                selectable="true"
                                vlaue={i}>
                                <ListItemText
                                    primary={request.user_first_name + " " + request.user_last_name + " wants to join " + request.project_title}/>
                                <Button
                                    onClick={() => this.joinRequestClicked(request.project_id, request.user_id, i)}>Approve</Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        )
    }

    render() {
        const {classes} = this.props
        return (
            // <div className={classes.root}>
            //     <GridContainer spacing={2}>
            //         {this.state.projects.map(card => (
            //             <GridItem xs={12} sm={12} md={6} key={card.id}>
            //                 <ProjectCard data={card}/>
            //             </GridItem>
            //         ))} 
            //     </GridContainer>
            // </div>
            <ResponsiveDrawer name={"Dashboard"}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4}>
                        <Notifications notifyList={notifications} title="Notifications"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Notifications notifyList={notifications} title="Upcoming Deadlines"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Notifications notifyList={this.state.requests.map((request, i) => {
                            return {
                                notifyId: i,
                                userId: request.user_id,
                                projectId: request.project_id,
                                profilePic: `https://picsum.photos/${Math.floor(Math.random() * 31) + 120}`,
                                userName:request.user_first_name + " " + request.user_last_name,
                                projectName: request.project_title,
                                details: request.project_short_description,
                                date: request.request_date_time
                            }
                        })} title="Project Registration Approvals" approveFunction={this.joinRequestClicked}/>
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView className={classes.root} cardData={data} title="Projects Updates"/>
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView className={classes.root} cardData={data} title="Projects to Approve"/>
                    </Grid>
                </Grid>
                {this.renderRequestsList()}
            </ResponsiveDrawer>

        )
    }
}

export default withStyles(styles)(Dashboard)
