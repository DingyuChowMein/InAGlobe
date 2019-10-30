// Main ReactJS libraries
import React, {Component} from 'react'
import {withRouter} from "react-router-dom"

// Material UI libraries
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core'

// Imports of different components and layouts in project
import Copyright from '../../components/Copyright/Copyright'

// Importing class's stylesheet
import styles from "../../assets/jss/views/signInSideStyle"

import { userService } from "../../services/userService";

class SignInSide extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            loginFailed: false
        }

        this.handleFormChange = this.handleFormChange.bind(this);
        this.loginPressed = this.loginPressed.bind(this);
    }


    handleFormChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    loginPressed() {
        // You can authenticate here
        userService.login(this.state.email, this.state.password).then(token => {
            console.log(token)
                if (token === "") {
                    this.setState({
                        loginFailed: true
                    })
                    alert('INVALID')
                } else {
                    this.props.history.push("/main");
                    this.setState({
                        loginFailed: false
                    })
                }
            }
        );

    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <Grid container component="main" className={classes.root}>
                    <CssBaseline/>
                    <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <this.props.icon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleFormChange}
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleFormChange}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary"/>}
                                    label="Remember me"
                                />
                                <Button
                                    // type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.loginPressed}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/login/signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Box mt={5}>
                                    <Copyright/>
                                </Box>
                            </form>
                        </div>
                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default withRouter(withStyles(styles)(SignInSide))