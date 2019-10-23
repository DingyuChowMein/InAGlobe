import React from 'react'
import ReactDOM from 'react-dom'
import Home from './Home.js'
import { Router } from "react-router-dom"
import { createBrowserHistory } from "history"

it('Home renders without crashing', () => {
    const hist = createBrowserHistory()
    const div = document.createElement('div')
    ReactDOM.render(<Router history={hist}>                    
                        <Home />
                    </Router>, div)
    ReactDOM.unmountComponentAtNode(div)
})