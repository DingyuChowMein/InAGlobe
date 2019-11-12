import config from '../config'
import {authHeader} from '../helpers/auth-header'


// const apiUrl = 'http://localhost:5000';
// const apiUrl = 'https://inaglobe-api.herokuapp.com';

export const commentsService = {
    getComments, postComment
};

function getComments(projectId) {
    var token = JSON.parse(localStorage.getItem('user')).token;
    var bearer = 'Bearer ' + token;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': bearer,
        },
    };

    return fetch(config.apiUrl + '/comments/' + projectId.toString() + '/', requestOptions);
}

function postComment(projectId) {
    var token = JSON.parse(localStorage.getItem('user')).token;
    var bearer = 'Bearer ' + token;
    fetch(config.apiUrl + `/comments/${projectId}/`, {
        method: 'post',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })

}

