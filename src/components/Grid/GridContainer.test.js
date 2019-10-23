import React from 'react'
import ReactDOM from 'react-dom'
import GridContainer from './GridContainer'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<GridContainer />, div)
    ReactDOM.unmountComponentAtNode(div)
})