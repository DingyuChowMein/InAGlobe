import config from '../config'
import { authHeader } from '../helpers/auth-header'


// const apiUrl = 'http://localhost:5000';
// const apiUrl = 'https://inaglobe-api.herokuapp.com';

export const userService = {
    login, signUp
}

function signUp(firstName, lastName, email, password, userType) {
    console.log(config.apiUrl + '/users/')
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            userType: userType
        })
    }

    return fetch(config.apiUrl + '/users/', requestOptions)
        .then(response => response.statusText)
}

function login(email, password) {
    console.log(config.apiUrl + '/users/tokens/')

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + window.btoa(email + ":" + password)
        }
    }

    return fetch(config.apiUrl + '/users/tokens/', requestOptions)
        .then(response => response.json())
        .then(token => {
            // login successful if there's a user in the response
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                // user.authdata = window.btoa(email + ':' + password);
            if (Object.keys(token).length === 0) {
                localStorage.setItem('token', '')
                return ''
            }

            localStorage.setItem('token', token.token)
            return token.token
        });
}

