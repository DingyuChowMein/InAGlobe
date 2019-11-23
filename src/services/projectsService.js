import config from "../config"

function getProjects() {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;

    return fetch(`${config.apiUrl}/projects/`, {
        mode: 'cors',
        method: 'get',
        headers: {
            'Authorization': bearer
        },
    }).then(res => res.json())
}

function postProject(data) {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;
    return fetch(`${config.apiUrl}/projects/`, {
        mode: 'cors',
        method: 'post',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export const projectService = {
    getProjects, postProject
};
