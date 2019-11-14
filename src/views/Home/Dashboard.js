// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { 
    withStyles, 
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Button,
} from '@material-ui/core'
import { UpdateOutlined } from "@material-ui/icons"

// Imports of different components in project
import CardScrollView from '../../components/ScrollView/CardScrollView'
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import Notifications from '../../components/Notifications/Notifications'
import Deadlines from "../../components/Deadlines/Deadlines"
import ProjectApprovals from '../../components/Approvals/ProjectApprovals'
// import GridContainer from "../../components/Grid/GridContainer"
// import GridItem from "../../components/Grid/GridItem"
// import ProjectCard from "../ProjectList/ProjectCard"

import config from '../../config'
import { dashboardService } from "../../services/dashboardService"

// Importing class's stylesheet
import styles from "../../assets/jss/views/homePageStyle"

// Example data
// import data from "../../assets/data/ProjectData"
// import notifications from "../../assets/data/NotificationData"
// import deadlines from "../../assets/data/DeadlinesData"
// import approvals from "../../assets/data/ProjectApprovalData"


class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            projects: [],
            requests: [],
            userType: JSON.parse(localStorage.getItem('user')).permissions
        }

    }

    joinRequestClicked = (project_id, user_id, index) => {
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

    renderRequestsList = () => {
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
                                <ListItemText primary={request.user_first_name + " " + request.user_last_name + " wants to join " + request.project_title}/>
                                <Button onClick={() => this.joinRequestClicked(request.project_id, request.user_id, i)}>Approve</Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        )
    }

    render() {
        const { classes } = this.props
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
                        <Notifications 
                            notifyList={[]} 
                            title="Notifications"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Deadlines 
                            deadlineList={[]} 
                            title="Upcoming Deadlines"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <ProjectApprovals 
                            approvalList={[]} 
                            title="User Approvals for Projects"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView 
                            className={classes.root} 
                            cardData={[]} 
                            title="Projects Updates"
                            EmptyIcon={UpdateOutlined}
                            emptyText="No Updates for any Ongoing Projects"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView 
                            className={classes.root} 
                            cardData={[]} 
                            title="Projects to Approve"
                            EmptyIcon={UpdateOutlined}
                            emptyText="No Approvals Needed for New Projects"
                        />
                    </Grid>
                </Grid>
            </ResponsiveDrawer>

        )
    }
}

export default withStyles(styles)(Dashboard)
