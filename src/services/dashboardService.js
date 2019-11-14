import config from "../config";

export const dashboardService = {
    getDashboard
};

function getDashboard() {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;
    return fetch(config.apiUrl + '/dashboard/', {
        method: 'get',
        headers: {
            'Authorization': bearer
        },
    })
        .then(res => res.json())
}
