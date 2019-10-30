// Main ReactJS libraries
import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'

// Material UI libraries
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

// Imports of different components in project
import Copyright from "../../components/Copyright/Copyright"

// Importing class's stylesheet
import styles from "../../assets/jss/views/signUpStyle"
import { userService } from "../../services/userService"

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            signUpFailed: false,
            userType: "",
            labelWidth: 0
        }
        this.inputLabel = null
        this.handleFormChange = this.handleFormChange.bind(this)
        this.signUpPressed = this.signUpPressed.bind(this)
    }

    handleFormChange(e) {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    signUpPressed() {
        // You can authenticate here
        userService.signUp(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.password,
            this.state.userType)
            .then(response => {
                console.log(response)
                confirmAlert({
                    title: "Response",
                    message: response["message"],
                    buttons: [
                        {
                            label: "Ok",
                            onClick: () => this.props.history.push("/login")
                        }
                    ]
                })
            }
        )
    }

    componentDidMount() {
        this.setState({
            labelWidth: this.inputLabel.offsetWidth
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <this.props.icon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    onChange={this.handleFormChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={this.handleFormChange}
                                    autoComplete="lname"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={this.handleFormChange}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    onChange={this.handleFormChange}
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl 
                                    variant="outlined"
                                    required
                                    fullWidth
                                >
                                    <InputLabel ref={(inputRef) => { this.inputLabel = inputRef }} id="userTypeLabel">Select User Type</InputLabel>
                                    <Select
                                        labelId="userTypeLabel"
                                        id="userType"
                                        name="userType"
                                        value={this.state.userType}
                                        onChange={this.handleFormChange}
                                        labelWidth={this.state.labelWidth}
                                    >
                                        <MenuItem value={"HUMANITARIAN"}>Humanitarian</MenuItem>
                                        <MenuItem value={"ACADEMIC"}>Academic</MenuItem>
                                        <MenuItem value={"STUDENT"}>Student</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.signUpPressed}
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/login/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        )
    }
}

export default withStyles(styles)(SignUp)