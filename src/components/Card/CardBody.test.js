import React from 'react'
import ReactDOM from 'react-dom'
import CardBody from './CardBody'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CardBody />, div)
    ReactDOM.unmountComponentAtNode(div)
})