import React, {Component} from 'react'

import {withStyles} from "@material-ui/core"

import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

import styles from "../../assets/jss/views/profileStyle"

class Profile extends Component {

    render() {
        const user = JSON.parse(localStorage.getItem('user'))
        let userType;
        switch (user.permissions) {
            case 0:
                userType = "academic"
                break
            case 1:
                userType = "humanitarian"
                break
            case 2:
                userType = "academic"
                break
            case 3:
                userType = "student"
                break
        }

        return (
            <ResponsiveDrawer name={"User Profile"}>
                <h5><b>User Id</b> {user.userid}</h5>
                <h5><b>User Type</b> {userType}</h5>
                <h5><b>Name</b> {user.firstname + " " + user.lastname}</h5>
                <h5><b>Email</b> {user.email}</h5>
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(Profile)