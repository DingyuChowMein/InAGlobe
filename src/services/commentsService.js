import config from '../config'
import { authHeader } from '../helpers/auth-header'


// const apiUrl = 'http://localhost:5000';
// const apiUrl = 'https://inaglobe-api.herokuapp.com';

export const commentsService = {
    getComments
};

function getComments(projectId){
    var token = localStorage.getItem('token');
    var bearer = 'Bearer ' + token;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': bearer,
        },
    };

    return fetch(config.apiUrl + '/comments/' + projectId.toString() + '/', requestOptions);
}

