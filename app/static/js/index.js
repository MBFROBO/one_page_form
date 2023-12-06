const APP = 'dispatcher-room-ui';
const URLS = [
    'https://dispatcher.farvater.group/api/auth/',
    'https://dispatcher.farvater.group/api/autz/',
    'https://dispatcher.farvater.group/api/ability/',
    'https://dispatcher.farvater.group/'
];

function auth_module_test(username, password, query, admin) {
    axios.post(URLS[0], query.auth_schema(username,password)).then((response) => {
        let rsp = response;
        console.log(rsp);
        var auth_token = rsp['data']['data']['login']['token'];
        var auth_refresh_token = rsp['data']['data']['login']['refreshToken'];
        
    })
}

function auth_module(username, password, query, admin) {
    try {
        axios.post(URLS[0], query.auth_schema(username,password)).then((response) => {
            let rsp = response;
            var auth_token = rsp['data']['data']['login']['token'];
            var auth_refresh_token = rsp['data']['data']['login']['refreshToken'];

            document.cookie = 'auth_farvater_admin_brend='+auth_token + ';domain=.farvater.group; path=/';
            document.cookie = 'AXIIT_FARVATER-authentication-token='+auth_token + ';domain=.farvater.group; path=/';
            document.cookie = 'AXIIT_FARVATER-authentication-refresh-token='+auth_refresh_token + ';domain=.farvater.group; path=/';

            axios.post(URLS[1],{'query':query.autz_query()}, {headers: query.autz_schema(auth_token, APP)}, withCredentials=true).then((response) => {
                if (response['data']['data']["authorize"]['token']) {
                    var autz_token = response['data']['data']["authorize"]['token'];
                    var autz_refresh_token = response['data']['data']["authorize"]['refreshToken'];
                    document.cookie = 'AXIIT_FARVATER-dispatcher-room-ui-authorization-token=' + autz_token + ';domain=.farvater.group; path=/';
                    document.cookie = 'AXIIT_FARVATER-dispatcher-room-ui-authorization-refresh-token='+autz_refresh_token + ';domain=.farvater.group; path=/';

                    if (admin == false) {
                    // axios.post('https://dispatcher.farvater.group/api/ability/', query.ability_schema(), { 
                    //     headers: {'Authorization':'Bearer ' + autz_token},
                    //     withCredentials: true}).then((response) => {
                    //     if (response.status == 200) {
                        window.location.href = URLS[3];    
  
                    } else {
                        window.location.href = '/admin/add_client';
                    }
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
    
}

function token_parse(responce_body) {}