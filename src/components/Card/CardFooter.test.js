import React from 'react'
import ReactDOM from 'react-dom'
import CardFooter from './CardFooter'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CardFooter />, div)
    ReactDOM.unmountComponentAtNode(div)
})