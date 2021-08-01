
const handler = {};

handler.notFoundHandler = (requestProperty, callback) => {
    
    callback(404, {
        message: 'Your requested URL was not found!'
    })
}

module.exports = handler;