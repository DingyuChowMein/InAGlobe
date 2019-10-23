import React from 'react'
import ReactDOM from 'react-dom'
import AddProposal from './AddProposal'

it('AddProposal renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AddProposal />, div)
    ReactDOM.unmountComponentAtNode(div)
})