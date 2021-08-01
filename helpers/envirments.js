
// module scaffolding 
const environments = {};

environments.staging = {
    port: 5500,
    envName: 'staging'
}

environments.production = {
    port: 4000,
    envName: 'production'
}

// determine which environments was passed
const currentEnviroment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport = typeof (environments[currentEnviroment]) === 'object' ? environments[currentEnviroment] : environments.staging;


module.exports = environmentToExport;