// Main ReactJS libraries
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// Material UI libraries
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'

// Importing webpath data for drawer links
import { drawerRoutes } from '../../routes'

// Importing images from assets
import logo from '../../assets/img/logo.png'

// Importing class's stylesheet
import styles from "../../assets/jss/components/responsiveDrawerStyle"
import RegularButton from "../CustomButtons/RegularButton";

class ResponsiveDrawer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mobileOpen: false,
            userPermissions: localStorage.getItem('permissions')
        };
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
        this.redirectTo = this.redirectTo.bind(this)
    }

	handleDrawerToggle() {
		this.setState({
            mobileOpen: !this.state.mobileOpen
        })
    }

    redirectTo(link) {
        const history = this.props.history
        history.push(link)
    }
    
    render() {
        const { classes, container, name } = this.props

        const drawer = (
            <div>
                <div className={classes.toolbar} style={{ textAlign: "left" }}>
                    <span className={classes.logoImage}>
                        <img src={logo} alt="logo" className={classes.img} />
                    </span>
                    <span className={classes.logoText}>
                        <p className={classes.logoTextFont}>InAGlobe</p>
                    </span>
                </div>
                <Divider />
                <List>
                    {drawerRoutes.map(route => (
                        route.icon !== null && route.userLevel >= this.state.userPermissions
                        ?
                        <ListItem 
                            button 
                            onClick={() => this.redirectTo(route.layout + route.path)}
                            key={route.name}
                        >
                            <ListItemIcon><route.icon /></ListItemIcon>
                            <ListItemText primary={route.name} />
                        </ListItem>
                        : 
                        null
                    ))}
                </List>
                <Divider />
                <div className={classes.logoutButton}>
                    <RegularButton onClick={() => this.props.history.push("/login")} color="primary">LogOut</RegularButton>
                </div>
            </div>
        )

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" color="secondary" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {name}
                        </Typography>

                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor="left"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>


                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.props.children}
                </main>
            </div>
        )
    }
}

ResponsiveDrawer.propTypes = {
	container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
}

export default withRouter(withStyles(styles)(ResponsiveDrawer))
