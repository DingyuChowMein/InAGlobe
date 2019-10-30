import config from 'config';
import {authHeader} from '../helpers';

export const userService = {
    login,
    logout,
    getAll
};

function login(email, password) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + base64.encode(email + ":" + password),
        }
    };

    return fetch(`${config.apiUrl}/users/tokens/`, requestOptions)
        .then(response => response.json())
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                // user.authdata = window.btoa(email + ':' + password);
                localStorage.setItem('user', user.token);
            }

            return user;
        });
}

