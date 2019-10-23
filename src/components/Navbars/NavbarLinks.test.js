import React from 'react'
import ReactDOM from 'react-dom'
import NavbarLinks from './NavbarLinks'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<NavbarLinks />, div)
    ReactDOM.unmountComponentAtNode(div)
})