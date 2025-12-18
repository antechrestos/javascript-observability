#!/usr/bin/env node


const http = require('http');
const opentTelementrySdk = require('./opentelemetry-sdk');
const process = require('process');
const log = require('./log');
const logger = log(__filename);


function buildServer(app, defaultPort) {
    const port = normalizePort(process.env.PORT || defaultPort);
    app.set('port', port);
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening(server));
    /* remplace le process.on('SIGTERM', () => onClose); */
    server.on('close', onClose);
}


function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(server) {
    return function (){
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        logger.info('Listening on ' + bind);
    }
}

function onClose(){
    opentTelementrySdk.shutdown()
        .then(() => console.log('Sdk terminated'))
        .catch((error) => console.log('Error terminating sdk', error))
        .finally(() => console.log('Sdk terminated'));
}

module.exports = buildServer;