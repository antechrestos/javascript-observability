const opentelemetriApi = require("@opentelemetry/api");

const meter  = opentelemetriApi.metrics.getMeter(
    global.APPLICATION,
    global.VERSION,
);

module.exports = meter;