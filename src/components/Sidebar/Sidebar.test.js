import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './Sidebar'
import routes from '../../routes'
import { Router } from "react-router-dom"
import { createBrowserHistory } from "history"

it('Card renders without crashing', () => {
    const hist = createBrowserHistory()
    const div = document.createElement('div')
    ReactDOM.render(<Router history={hist}>                    
                        <Sidebar routes={routes} />
                    </Router>, div)
    ReactDOM.unmountComponentAtNode(div)
})