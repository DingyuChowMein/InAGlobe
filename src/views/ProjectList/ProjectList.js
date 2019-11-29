// Main ReactJS libraries
import React, {Component} from 'react'

// Material UI libraries
import {withStyles, Grid} from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import ProjectCard from "./ProjectCard"

// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"

class ProjectList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projects: [],
            value: ''
        }
        this.onSearch.bind(this)
        this.updateValue.bind(this)
    }

    componentDidMount() {
        projectService.getProjects()
            .then(data => {
                console.log(data);
                data.projects.forEach(project => project.status = (project.status === 0 ? "Needs Approval" : "Approved"))
                this.setState({
                    projects: data.projects
                })
            })
            .catch(console.log)
    }

    onSearch = (query) => {
        this.setState({
        value: query
      })

      const filteredList = this.state.projects.filter(
        project => (project.title.toLowerCase().includes(this.state.value.toLowerCase())));

      this.setState({
        projects: filteredList
      })
    }

    updateValue = (query) => {

      if (typeof(query) !== "undefined") {
        if (query.length <= this.state.value.length) {
          this.componentDidMount()
        }
      }
      this.setState({value: query})
    }

    render() {
        const {classes} = this.props;
        return (
            <ResponsiveDrawer name={"Project List"}
              onSearch ={this.onSearch}
              updateValue = {this.updateValue}
            >
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        {this.props.data.map(card => (
                            <Grid item xs={12} sm={12} md={6} key={card.id}>
                                <ProjectCard data={card}/>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </ResponsiveDrawer>
        )
    }
}

export default withStyles(styles)(ProjectList)
