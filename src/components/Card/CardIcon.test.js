import React from 'react'
import ReactDOM from 'react-dom'
import CardIcon from './CardIcon'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CardIcon />, div)
    ReactDOM.unmountComponentAtNode(div)
})