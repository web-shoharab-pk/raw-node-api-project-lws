
// dependencies
const http = require('http');
const environment = require('./helpers/envirments')
 const data = require('./lib/data')

const { handleReqRes } = require('./helpers/handleReqRes')

// app object - module scaffolding
const app = {};

// testing file system
// data.delete('test', 'newFile+',  function(err) { 
//     console.log('Error was', err,)
// } ) 

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`)
    });
}

app.handleReqRes = handleReqRes;

//start the createServer
app.createServer()