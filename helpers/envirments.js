
// module scaffolding 
const environments = {};

environments.staging = {
    port: 5500,
    envName: 'staging',
    secretKey: 'kjasdhflakshdd5147'
}

environments.production = {
    port: 4000,
    envName: 'production',
    secretKey: 'kjasdhsdfgflakshdd5147'
}

// determine which environments was passed
const currentEnviroment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport = typeof (environments[currentEnviroment]) === 'object' ? environments[currentEnviroment] : environments.staging;


module.exports = environmentToExport;