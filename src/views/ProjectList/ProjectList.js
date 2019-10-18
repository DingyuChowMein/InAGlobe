import React, { Component } from 'react';
import { makeStyles } from "@material-ui/core/styles"
import ProjectCard from "./ProjectCard.js"

import pillPicture from "../../assets/img/card_example1.png"
import smokePicture from "../../assets/img/card_example2.png"
import emissionPicture from "../../assets/img/card_example3.png"
import mobilePicture from "../../assets/img/card_example4.png"

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js"
import GridContainer from "../../components/Grid/GridContainer.js"
import GridItem from "../../components/Grid/GridItem.js"

//To be removed on successful implementation of the upload function
    const cardData = [
        {
            title: "Pill Organiser for Self-Medication",
            organisation: "Fundaćion Mozambique Sur",
            status: "Adopted (Department of Bioengineering)",
            description: "A pill organiser for orphans in Casa do Gaiato-Maputo to self medicate appropriately. Motivated by the poor disease management due to limited number of healthcare workers.",
            image: pillPicture
        },
        {
            title: "Low-Smoke Cooking Environment",
            organisation: "Helvetas Swiss Intercooperation",
            status: "Adopted (Engineering Change)",
            description: "Develop a low-cost stove that produced little or no smoke; or an efficient extractor system that can be coupled to current cooking methods.",
            image: smokePicture
        },
        {
            title: "Low Emission Cashew Nut Processor",
            organisation: "Helvetas Swiss Intercooperation",
            status: "Adopted (Engineering Change)",
            description: "Develop a Cashew Nut processor with low CO2 emissions, as current technologies are highly polluting.",
            image: emissionPicture
        },
        {
            title: "Mobile Grain Network-Marketplace",
            organisation: "Helvetas Swiss Intercooperation",
            status: "Unadopted",
            description: "Create a mobile phone application that informs of the fair local market price for different kinds of food productions.",
            image: mobilePicture
        }
    ];

class ProjectList extends React.Component {

     constructor(props) {
        super(props);
        this.state = {
            projects: [],
         };
     }

//     componentDidMount() {
//           fetch(`inaglobe-api.herokuapp.com/GetProjects`)
//               .then(res => res.json())
//               .then(result => this.setState({ projects: result}))
//       };

//     componentWillMount() {
//        this.getData();
//     }

//     getData() {
//        // create a new XMLHttpRequest
//        var xhr = new XMLHttpRequest()
//
//        // get a callback when the server responds
//        xhr.addEventListener('load', () => {
//          // update the state of the component with the result here
//          console.log(xhr.responseText)
//          this.setState({ projects: xhr.responseText})
//        })
//        // open the request with the verb and the url
//        xhr.open('GET', 'https://inaglobe-api.herokuapp.com/GetProjects')
//        // send the request
//        xhr.send()
//      }

     componentDidMount() {
        fetch('/GetProjects')
          .then(results => results.json())
          .then(results => console.log(results))
          .catch(err => console.log(err))
//          this.setState({projects: ["testing","hello", 7]})

//        const response = fetch('https://inaglobe-api.herokuapp.com/GetProjects');
//        const data = response.json();
//        this.setState({projects: data})


     }


        render() {
            const { projects } = this.state;

            return (
//            {projects[0].map(projects[0] => <div>{projects[0].Title}</div>)}
            <div>{this.state.projects[0]["Title"]}</div>
//                    <GridContainer spacing={2}>
//                        {cardData.map(card => (
//                            <GridItem xs={12} sm={12} md={6}>
//                                <ProjectCard
//                                    title={this.state.projects.Title}
//                                    organisation={this.state.projects.ProjectOwner}
//                                    status={card.status}
//                                    description={this.state.projects.ShortDescription}
//                                    image={card.image}
//                                />
//                            </GridItem>
//                        ))}
//                    </GridContainer>
            );
        }

 }

export default ProjectList;
