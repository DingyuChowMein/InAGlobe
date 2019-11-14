import React, {Component} from "react"
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import {withStyles} from "@material-ui/styles"
import School from '@material-ui/icons/School';

import styles from "../../assets/jss/views/proposalPageStyle"
import config from "../../config";

class ProposalPage extends Component {
    render() {
        const {classes, data, children, isPreview} = this.props

        return (
            <div>
                <div className={classes.container}>
                    <h1>{data.title}</h1>
                </div>
                <div className={classes.container}>
                    <h2>{data.organisation}</h2>
                </div>
                {data.images.map(image => (
                    <div className={classes.imagesContainer}>
                        <img
                            alt={data.title}
                            src={isPreview ? URL.createObjectURL(image) : config.s3Bucket + image}
                            className={classes.projectImages}
                        />
                    </div>
                ))}
                <div className={classes.container}>
                    <h3>{data.status}</h3>
                </div>
                <div className={classes.container}>
                    <h4>{data.location}</h4>
                </div>
                <div className={classes.container}>
                    <h5>{data.detailedDescription}</h5>
                </div>
                <div className={classes.container}>
                    {data.documents.map(doc => (
                        <a href={isPreview ? URL.createObjectURL(doc) : config.s3Bucket + doc}>
                            {isPreview ? doc["name"] : /[^/]*$/.exec(doc)[0]}{"\n"}
                        </a>
                    ))}
                </div>
                <VerticalTimeline>
                    {
                        data.checkpoints.map(event => (
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                date={event.date}
                                icon = {<School/>}
                            >
                                <h3 className="vertical-timeline-element-title">{event.title}</h3>
                                <h4 className="vertical-timeline-element-subtitle">{event.subtitle}</h4>
                                <p>{event.text}</p>
                                <p>{event.documents}</p>
                            </VerticalTimelineElement>
                        ))
                    }
                </VerticalTimeline>

                {children}

            </div>

        )
    }
}

export default withStyles(styles)(ProposalPage)