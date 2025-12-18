
const opentelemetriApi = require('@opentelemetry/api')

const tracer = opentelemetriApi.trace.getTracer(
    global.APPLICATION,
    global.VERSION,
);

module.exports = tracer;