// Main ReactJS libraries
import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from "history"
import { Router, Route, Switch, Redirect } from "react-router-dom"

// Importing and applying a global stylesheet
import "./assets/css/material-dashboard-react.css?=1.8.0"

// Imports of different components and layouts in project
import * as serviceWorker from "./serviceWorker"
import Authentication from "./layouts/Authentication/Authentication"

const hist = createBrowserHistory()

ReactDOM.render(
	<Router history={hist}>
		<Switch>
			<Route path="/login" component={Authentication}/>
			<Redirect from="/" to="/login" />
		</Switch>
	</Router>,
	document.querySelector('#root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()