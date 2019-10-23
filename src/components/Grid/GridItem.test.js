import React from 'react'
import ReactDOM from 'react-dom'
import GridItem from './GridItem'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<GridItem />, div)
    ReactDOM.unmountComponentAtNode(div)
})