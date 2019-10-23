import React from 'react'
import ReactDOM from 'react-dom'
import CustomInput from './CustomInput'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CustomInput />, div)
    ReactDOM.unmountComponentAtNode(div)
})