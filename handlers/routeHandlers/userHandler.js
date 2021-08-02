
const data = require('./../../lib/data');
const { hash } = require('./../../helpers/utilities');
const { parseJSON } = require('./../../helpers/utilities');

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
            // lookup the user
            data.read('users', phone, function (err, uData) {
                const userData = { ...parseJSON(uData) };
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }

                    // update database
                    data.update('users', phone, userData, function (err) {
                        if (!err) {
                            callback(200, {
                                message: 'User was updated successfully!'
                            })
                        } else {
                            callback(500, {
                                'error': 'There was a problem in server side. Update not working!'
                            })
                        }
                    })
                } else {
                    callback(400, {
                        'error': 'You have a problem in your request!1'
                    })
                }
            })
        } else {
            callback(400, {
                'error': 'You have a problem in your request!'
            })
        }
    } else {
        callback(400, {
            'error': 'Phone number is invalid. Please try again...!'
        })
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
        // lookup the user
        data.read('users', phone, (err1, userData) => {
            if (!err1 && userData) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was successfully deleted!',
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