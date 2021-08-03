
const data = require('./../../lib/data');
const { hash, parseJSON } = require('./../../helpers/utilities');
const { createRandomString } = require('./../../helpers/utilities');

const handler = {};

handler.tokenHandler = (requestProperty, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperty.method) > -1) {
        handler._token[requestProperty.method](requestProperty, callback);
    } else {
        callback(405)
    }
}

handler._token = {};

handler._token.get = (requestProperty, callback) => {
    const id = typeof requestProperty.queryStringObject.id === 'string' && requestProperty.queryStringObject.id.trim().length === 20 ? requestProperty.queryStringObject.id : false;
    
    if (id) {
        // lookup the token 
        data.read('tokens', id, function (err, tokenData) {
            const token = { ...parseJSON(tokenData) }
            if (!err && token) { 
                callback(200, token)
            } else {
                callback(404, {
                    'error': 'Requested token was not found!'
                })
            }
        })
    } else {
        callback(404, {
            'error': 'Requested token was not found!'
        })
    }
}

handler._token.post = (requestProperty, callback) => {
    const id = typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 11 ? requestProperty.body.id : false;

    const password = typeof requestProperty.body.password === 'string' && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password : false;

    if (id && password) {
        data.read('users', id, function (err, uData) {
            const userData = parseJSON(uData);
            let hashedPassword = hash(password);
            if (hashedPassword === userData.password) {
                let tokenId = createRandomString(20);
                console.log(tokenId)
                let expires = Date.now() + 60 * 60 * 100;
                let tokenObject = {
                    id,
                    'id': tokenId,
                    expires
                };

                // store the token
                data.create('tokens', tokenId, tokenObject, function (err) {
                    if(!err) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            'error': 'There was a problem in the server side! check'
                        })
                    }
                })
            } else {
                callback(400, {
                    'error': 'Password is not valid!'
                })
            }
        })
    } else {
        callback(400, {
            message: 'You have a problem in your request!'
        })
    }
}

handler._token.put = (requestProperty, callback) => {
    const id = typeof requestProperty.body.id === 'string' && requestProperty.body.id.trim().length === 20 ? requestProperty.body.id : false;

    const extend = typeof requestProperty.body.extend === 'boolean' && requestProperty.body.extend === true ? true : false;
    console.log(requestProperty, extend)

    if(id && extend) {
        data.read('tokens', id, function (err, tokenData) {
            let tokenObject = parseJSON(tokenData)
            if(tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;

                // store the updated token data
                data.update('tokens', id, tokenObject, function (err) {
                    if(!err) {
                        callback(200, {
                            "message" : "token updated!"
                        });
                    } else {
                        callback(500, {
                            'error': 'There was a server side error!'
                        })
                    }
                })
            } else {
                callback(400, {
                    'error': 'Token already expired!'
                })
            }
        })
    } else {
        callback(400, {
            'error': 'There was a problem in your request! check'
        })
    }
}

handler._token.delete = (requestProperties, callback) => {
        // check the id number if valid
        const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // lookup the user
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }

};


module.exports = handler;