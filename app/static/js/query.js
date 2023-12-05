
class Query {
    static auth_query() {
        let query = 'mutation loginPortal($login3: String!, $pass3: String!){' +
            'login(login: $login3, password: $pass3){' +
              '...AuthFragment __typename' +
              '}'+
          '}'+
          'fragment AuthFragment on AuthPayload {'+
            'token refreshToken '+
            'account {' +
                'id login email phone name '+
                 'banned ' +
                 'createdAt updatedAt'+  
               '}'+ 
          '}';
        return query
    }

    static autz_query() {
        let query = 'mutation Autz{' +
            'authorize { token refreshToken }' +
        '}';
        return query
    }

    static auth_schema(login, passw) {
        let json = {
            "login3":login,
            "pass3":passw
        };
        
        let json_request = {
            "query":Query.auth_query(),
            "variables":json,
            "operationName":"loginPortal" 
        };

        return json_request
    }
    static autz_schema(token, app) {
        let headers = {
            "authentication":'Bearer '+ token,
            "application":app
        }
        return headers
    }

    static ability_query() {
        let query = `query getAbility {
            data: getAbility {
              profile {
                id
              }
              application {
                id
              }
              role {
                id
              }
              rules {
                action
                subject
                fields
                conditions
                inverted
                reason
              }
            }
          }`
        return query
    }

    
    static ability_schema() {
        let json_request = {
            'query':Query.ability_query(),
            'operationName':"getAbility"
        }
        return json_request
    }
}

class TokenParse {
    static auth_token_parse(response) {

    }
}

function auth_by_form() {
    
}