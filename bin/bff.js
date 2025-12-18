
// todo use environment
global.APPLICATION = 'BFF'
global.VERSION = '1.0.0'
const opentTelementrySdk = require('../opentelemetry-sdk');

opentTelementrySdk.start();
const bff = require('../bff')
const server = require('../server');

server(bff, '8081');
