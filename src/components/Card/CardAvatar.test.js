import React from 'react'
import ReactDOM from 'react-dom'
import CardAvatar from './CardAvatar'

it('Card renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<CardAvatar />, div)
    ReactDOM.unmountComponentAtNode(div)
})