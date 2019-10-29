// Main ReactJS libraries
import React, { Component } from 'react'

// Material UI libraries
import { withStyles } from '@material-ui/core'

// Imports of different components in project
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import GridContainer from "../../components/Grid/GridContainer"
import GridItem from "../../components/Grid/GridItem"
import ProjectCard from "./ProjectCard"

// Importing example card data
import cardData from "../../assets/data/ProjectData"

// Importing class's stylesheet
import styles from "../../assets/jss/views/projectListStyle"

class ProjectList extends Component {
  // componentDidMount(){
  //   var token = 'RQicsgKSjAjRyo5HEDYMQ7/voSQYZZVt'
  //   var bearer = 'Bearer ' + token

  //   fetch('http://localhost:5000/projects/', {
  //     method: 'get',
  //     headers: {
  //       'Authorization': bearer
  //     }
  //   })
  //     .then(res => res.json())
  //     .then((data) => {
  //       console.log(data)
  //       this.setState({ projects: data })
  //     })
  //     .catch(console.log)
  // }

	render() {
		const { classes } = this.props
		return (
			<ResponsiveDrawer name={"Project List"}>
				<div className={classes.root}>
					<GridContainer spacing={2}>
						{cardData.map(card => (
							<GridItem xs={12} sm={12} md={6} key={card.id}>
								<ProjectCard data={card}/>
							</GridItem>
						))}
					</GridContainer>
				</div>
			</ResponsiveDrawer>
		)
	}
}

export default withStyles(styles)(ProjectList)
