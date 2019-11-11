// Main ReactJS libraries
import React, {Component} from 'react'

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
import {withStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

// Imports of different components in project
import Copyright from "../../components/Copyright/Copyright"

// Importing class's stylesheet
import styles from "../../assets/jss/views/signUpStyle"
import {userService} from "../../services/userService"

class SignUp extends Component {

    constructor(props) {
        super(props);
        userService.logout();
        this.state = {
            email: {
                error: "",
                value: ""
            },
            password: {
                error: "",
                value: ""
            },
            firstName: {
                error: "",
                value: ""
            },
            lastName: {
                error: "",
                value: ""
            },
            userType: "STUDENT",
            labelWidth: 0
        };
        this.inputLabel = null
        this.handleFormChange = this.handleFormChange.bind(this)
        this.signUpPressed = this.signUpPressed.bind(this)
    }

    handleValidation = () => {
        let success = true;
        let emailError = ""
        let firstNameError = ""
        let lastNameError = ""
        let passwordError = ""

        if (!this.state.email.value.match(/^[\w\d]+@[\w\d]+\.(ac|org)\..*$/)) {
            emailError = "Must have .ac or .org email!";
            success = false;
        }

        if (this.state.firstName.value === "") {
            firstNameError = "First name cannot be empty!";
            success = false;
        }

        if (this.state.lastName.value === "") {
            lastNameError = "Last name cannot be empty!";
            success = false;
        }

        this.setState(prevState => ({
            email: {
                ...prevState.email,
                error: emailError
            },
            firstName: {
                ...prevState.firstName,
                error: firstNameError
            },
            lastName: {
                ...prevState.lastName,
                error: lastNameError
            }
        }));
        return success;
    };

    handleFormChange(e) {
        const {name, value} = e.target;
        this.setState({
            [name]: {
                error: "",
                value: value
            }
        });
    }

    signUpPressed() {
        // You can authenticate here
        if (this.handleValidation()) {
            userService.signUp(
                this.state.firstName.value,
                this.state.lastName.value,
                this.state.email.value,
                this.state.password.value,
                this.state.userType)
                .then(response => {
                    console.log(response);
                    this.props.history.push("/login")
                })
        }
    }

    componentDidMount() {
        this.setState({
            labelWidth: this.inputLabel.offsetWidth
        })
    }

    render() {
        const {classes} = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <this.props.icon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!(this.state.firstName.error === "")}
                                    name="firstName"
                                    onChange={this.handleFormChange}
                                    variant="outlined"
                                    required
                                    helperText={this.state.firstName.error}
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoComplete="fname"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!(this.state.lastName.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    helperText={this.state.lastName.error}
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={this.handleFormChange}
                                    autoComplete="lname"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!(this.state.email.error === "")}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    helperText={this.state.email.error}
                                    label="Email Address"
                                    name="email"
                                    onChange={this.handleFormChange}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!(this.state.password.error === "")}
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
                                    <InputLabel ref={inputLabel => {
                                        this.inputLabel = inputLabel
                                    }} id="userTypeLabel">Select User Type</InputLabel>
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
                    <Copyright/>
                </Box>
            </Container>
        )
    }
}

export default withStyles(styles)(SignUp)