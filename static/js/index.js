const APP = 'dispatcher-room-ui';
const URLS = [
    'https://dispatcher.farvater.group/api/auth/',
    'https://dispatcher.farvater.group/api/autz/',
    'https://dispatcher.farvater.group/api/ability/',
    'https://dispatcher.farvater.group/'
];



function auth_module(username, password, query) {
    axios.post(URLS[0], query.auth_schema(username,password)).then((response) => {
        let rsp = response;
        // var form = new FormData();
        // form.append('username', username);
        // form.append('password',password);
        var auth_token = rsp['data']['data']['login']['token'];
        var auth_refresh_token = rsp['data']['data']['login']['refreshToken'];

        axios.post(URLS[1],{'query':query.autz_query()}, {headers: query.autz_schema(auth_token, APP)}).then((response) => {
            if (response['data']['data']["authorize"]['token']) {
                var autz_token = response['data']['data']["authorize"]['token'];
                var autz_refresh_token = response['data']['data']["authorize"]['refreshToken'];

                document.cookie = 'domain=https://dispatcher.farvater.group/';
                document.cookie = 'AXIIT_FARVATER-authentication-token='+auth_token;
                document.cookie = 'AXIIT_FARVATER-authentication-refresh-token='+auth_refresh_token;
                document.cookie = 'AXIIT_FARVATER-dispatcher-room-ui-authorization-token=' + autz_token;
                document.cookie = 'AXIIT_FARVATER-dispatcher-room-ui-authorization-refresh-token='+autz_refresh_token

                axios.post(URLS[2], {'query':query.ability_query()}, {headers: {
                    'Authorization':'Bearer '+autz_token,
                    'Access-Control-Allow-Origin':'dispatcher.farvater.group'
                }, withCredentials:true}).then((response) => {
                    if (response.status == 200) {
                        window.location.href = URLS[3];

                    }
                })              
            }
        });
    });
}

function token_parse(responce_body) {}