// Main ReactJS libraries
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route, Redirect, withRouter } from "react-router-dom"

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
import { withStyles } from '@material-ui/core'

// Imports of different components and layouts in project
import Copyright from '../../components/Copyright/Copyright'
import MainPage from '../../layouts/MainPage/MainPage'

// Importing class's stylesheet
import styles from "../../assets/jss/views/signInSideStyle"

class SignInSide extends Component {

    constructor(props) {
        super(props)
        this.authenticate = this.authenticate.bind(this)
    }

    authenticate() {
        // You can authenticate here

        const hist = this.props.history
        return (
            ReactDOM.render(
                <Router history={hist}>
                    <Switch>
                        <Route path="/main" component={MainPage}/>
                        <Redirect from="/login/signin" to="/main" />
                    </Switch>
                </Router>,
                document.querySelector('#root'),
            )
        )
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <Grid container component="main" className={classes.root}>
                    <CssBaseline />
                    <Grid item xs={false} sm={4} md={7} className={classes.image} />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <this.props.icon />
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
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Button
                                    // type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.authenticate}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="/login/signup" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/login/signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Box mt={5}>
                                    <Copyright />
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
