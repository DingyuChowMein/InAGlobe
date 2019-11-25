import config from '../config'
import {authHeader} from '../helpers/auth-header'


// const apiUrl = 'http://localhost:5000';
// const apiUrl = 'https://inaglobe-api.herokuapp.com';

export const userService = {
    login, signUp, logout, confirm, send_reset_email, reset_password
}

function logout() {
    if (localStorage.getItem('user')) {
        const bearer = 'Bearer ' + JSON.parse(localStorage.getItem('user')).token;
        const requestOptions = {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Authorization': bearer
            }
        }
        console.log(config.apiUrl + '/users/tokens/')
        fetch(config.apiUrl + '/users/tokens/', requestOptions)
            .then(response => console.log(response));

        localStorage.clear();
        console.log("Logged out");
    }
}

function signUp(firstName, lastName, email, password, userType) {
    console.log(config.apiUrl + '/users/');
    console.log(userType);
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
            userType: userType.value
        })
    }

    return fetch(config.apiUrl + '/users/', requestOptions)
        .then(response => response.statusText)
}

function login(email, password) {
    console.log(config.apiUrl + '/users/tokens/');

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + window.btoa(email + ":" + password)
        }
    }

    return fetch(`${config.apiUrl}/users/tokens/`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function confirm(token) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`${config.apiUrl}/confirm/${token}/`, requestOptions)
        .then(handleResponse)
}

function reset_password(token, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({"password": password})
    };

    return fetch(`${config.apiUrl}/resetpassword/${token}/`, requestOptions)
        .then(handleResponse)
}

function send_reset_email(email) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email: email})
    };

    return fetch(`${config.apiUrl}/resetpassword/`, requestOptions)
        .then(handleResponse)
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                // location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    })
}
