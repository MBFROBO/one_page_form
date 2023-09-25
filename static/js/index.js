const APP = '';
const URLS = [
    'https://dispatcher.farvater.group/api/auth/',
    'https://dispatcher.farvater.group/api/autz/'
];

function autz_module(auth_token) {
    axios.post(URLS[1]).then((response) => {

    });
}

function auth_module(username, password) {
    axios.post(URLS[0]).then((response) => {

    });
}

function token_parse(responce_body) {}