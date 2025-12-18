// todo use environment
global.APPLICATION = 'API'
global.VERSION = '1.0.0'
const opentTelementrySdk = require('../opentelemetry-sdk');

opentTelementrySdk.start();
const api = require('../api');
const server = require('../server');

server(api, '8080');
