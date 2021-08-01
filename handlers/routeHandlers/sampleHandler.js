
const handler = {};

handler.sampleHandler = (requestProperty, callback) => {
    console.log(requestProperty)
    callback(200, {
        message: 'This is a sample url!'
    })
}

module.exports = handler;