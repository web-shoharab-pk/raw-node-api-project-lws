
const data = require('./../../lib/data');
const { hash } = require('./../../helpers/utilities');
const { parseJSON } = require('./../../helpers/utilities');
const tokenHandler = require('./../routeHandlers/tokenHandler')

const handler = {};

handler.userHandler = (requestProperty, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperty.method) > -1) {
        handler._users[requestProperty.method](requestProperty, callback);
    } else {
        callback(405)
    }
}

handler._users = {};

handler._users.get = (requestProperty, callback) => {
    const phone = typeof requestProperty.queryStringObject.phone === 'string' && requestProperty.queryStringObject.phone.trim().length === 11 ? requestProperty.queryStringObject.phone : false;

    if (phone) {

        // verify token 
        const token = typeof (requestProperty.headersObject.token) === 'string' ? requestProperty.headersObject.token : false;

        tokenHandler._token.verify(token, phone, function (tokenId) {
            console.log(tokenId)
            if (tokenId) {
                // lookup the user 
                data.read('users', phone, function (err, userData) {
                    const user = { ...parseJSON(userData) }
                    if (!err && user) {
                        delete user.password;
                        callback(200, user)
                    } else {
                        callback(404, {
                            'error': 'Requested user was not found!'
                        })
                    }
                })
            } else {
                callback(403, {
                    'error': 'Authentication failure!'
                })
            }
        })

        // lookup the user 
        data.read('users', phone, function (err, userData) {
            const user = { ...parseJSON(userData) }
            if (!err && user) {
                delete user.password;
                callback(200, user)
            } else {
                callback(404, {
                    'error': 'Requested user was not found!'
                })
            }
        })
    } else {
        callback(404, {
            'error': 'Requested user was not found!'
        })
    }
}

handler._users.post = (requestProperty, callback) => {

    const firstName = typeof requestProperty.body.firstName === 'string' && requestProperty.body.firstName.trim().length > 3 ? requestProperty.body.firstName : false;

    const lastName = typeof requestProperty.body.lastName === 'string' && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName.trim() : false;

    const phone = typeof requestProperty.body.phone === 'string' && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    const password = typeof requestProperty.body.password === 'string' && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password : false;

    const tosAgreement = typeof requestProperty.body.tosAgreement === 'boolean' && requestProperty.body.tosAgreement ? requestProperty.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {

        // make sure that user doesn't already exists
        data.read('users', phone, function (err) {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }

                // store the user to db
                data.create('users', phone, userObject, function (err) {
                    if (!err) {
                        callback(200, {
                            'message': 'User was created successfully!'
                        })
                    } else {
                        callback(500, {
                            'error': 'Could not create user!'
                        })
                    }
                })
            } else {
                callback(500, {
                    'error': 'There was a problem in server side!'
                })
            }
        })

    } else {
        callback(400, {
            message: 'You have a problem in your request!'
        })
    }
}

handler._users.put = (requestProperty, callback) => {
    const phone = typeof requestProperty.body.phone === 'string' && requestProperty.body.phone.trim().length === 11 ? requestProperty.body.phone : false;

    const firstName = typeof requestProperty.body.firstName === 'string' && requestProperty.body.firstName.trim().length > 3 ? requestProperty.body.firstName : false;

    const lastName = typeof requestProperty.body.lastName === 'string' && requestProperty.body.lastName.trim().length > 0 ? requestProperty.body.lastName.trim() : false;

    const password = typeof requestProperty.body.password === 'string' && requestProperty.body.password.trim().length > 0 ? requestProperty.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // verify token
            const token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    // loopkup the user
                    data.read('users', phone, (err1, uData) => {
                        const userData = { ...parseJSON(uData) };

                        if (!err1 && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.firstName = firstName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }

                            // store to database
                            data.update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'User was updated successfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in the server side!',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'You have a problem in your request!',
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: 'Authentication failure!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request!',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }

}

handler._users.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {

        // verify token 
        const token = typeof (requestProperty.headersObject.token) === 'string' ? requestProperty.headersObject.token : false;

        tokenHandler._token.verify(token, phone, function (tokenId) {
            console.log(tokenId)
            if (tokenId) {

            } else {
                callback(403, {
                    'error': 'Authentication failure!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};


module.exports = handler;