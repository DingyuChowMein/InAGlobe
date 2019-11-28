import React from 'react';
import {Route, Redirect} from "react-router-dom";

export const PrivateRoute = ({component: Component, data: data, ...rest}) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} data={data ? data.data : null} refresh={data ? data.refresh : null}/>
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}/>
);