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
        super(props);
        this.state = {
            projects: this.props.data,
            searchQuery: '',
            searchResults: [],
        };
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        // By default search query is empty string, so search displays all projects.
        this.setState({
            searchResults: this.state.projects,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // When project data changes on higher level, we update our current state ...
        if (prevProps.data !== this.props.data) {
            this.setState({
                projects: this.props.data,
            });
        }
        // ... we also have to update search results to account for these changes ...
        if (prevProps.data !== this.props.data ||
            // ... or if a new search query has been entered.
            prevState.searchQuery !== this.state.searchQuery) {
            this.setState({
                searchResults: this.state.projects.filter(project =>
                    project.title.toLowerCase().includes(
                        this.state.searchQuery
                    )
                ),
            });
        }
    }

    onSearch = (query) => {
        this.setState({
            searchQuery: query.toLowerCase(),
        })
    };

    render() {
        const {classes} = this.props;
        return (
            <ResponsiveDrawer
                name={"Project List"}
                onSearch={this.onSearch}
            >
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        {this.state.searchResults.map(card => (
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
