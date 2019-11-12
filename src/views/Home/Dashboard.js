// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles, Grid } from '@material-ui/core'

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

class Dashboard extends Component {
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
                        <Notifications notifyList={notifications} title="Notifications"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Notifications notifyList={notifications} title="Upcoming Deadlines"/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Notifications notifyList={notifications} title="Project Registration Approvals"/>
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView className={classes.root} cardData={data} title="Projects Updates"/>
                    </Grid>
                    <Grid item xs={12}>
                        <CardScrollView className={classes.root} cardData={data} title="Projects to Approve"/>
                    </Grid>
                </Grid>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(Dashboard)
