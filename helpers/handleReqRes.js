const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const { notFoundHandler } = require('./../handlers/routeHandlers/notFoundHandler')
const { parseJSON } = require('./utilities')

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headersObject = req.headers;


    const requestProperty = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }

    const decoder = new StringDecoder('utf-8');

    let realData = '';
     
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    });

    req.on('end', () => {
        realData += decoder.end();
        // console.log(realData)
        // requestProperty.body =  realData;
        requestProperty.body =  parseJSON(realData) ; 
        chosenHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

               // return the final response
               res.setHeader('Content-Type', 'application/json');
               res.writeHead(statusCode);
               res.end(payloadString);

        }) 
    })

}

module.exports = handler;