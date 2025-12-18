
// todo use environment
global.APPLICATION = 'EMAIL-SERVICE'
global.VERSION = '1.0.0'
const opentTelementrySdk = require('../opentelemetry-sdk');

opentTelementrySdk.start();
const log = require("../log");

const logger = log(__filename);

require('../messaging').listener(
    'amqp://my-user:my-pass@localhost:5672/my-v-host',
    'notification',
    (msg) => logger.debug('received notification ' + msg)
);

