import React from 'react'
import ReactDOM from 'react-dom'
import ProjectCard from './ProjectCard'

import cardData from '../../data/ProjectData/ProjectData'

it('ProjectCard renders without crashing', () => {
    cardData.map(card => {
        const div = document.createElement('div')
        ReactDOM.render(<ProjectCard
                            title={card.title}
                            organisation={card.organisation}
                            status={card.status}
                            description={card.shortDescription}
                            image={card.images[0]}
                        />, div)
        ReactDOM.unmountComponentAtNode(div)
    })
})