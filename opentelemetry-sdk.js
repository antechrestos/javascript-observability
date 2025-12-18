const opentelemetry = require('@opentelemetry/sdk-node');
const { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator} = require("@opentelemetry/core");
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');

const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
const {resourceFromAttributes} = require('@opentelemetry/resources');
const {ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION} = require('@opentelemetry/semantic-conventions');
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-proto");
const {OTLPMetricExporter} = require("@opentelemetry/exporter-metrics-otlp-proto");
const {propagation, context, ROOT_CONTEXT} = require("@opentelemetry/api");
const {AsyncLocalStorageContextManager} = require("@opentelemetry/context-async-hooks");


const traceExporter = new OTLPTraceExporter();
const metricReader = new PeriodicExportingMetricReader({
    // exporter: new ConsoleMetricExporter()
    exporter: new OTLPMetricExporter()
});

const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: global.APPLICATION,
    [ATTR_SERVICE_VERSION]: global.VERSION
});
const sdk = new opentelemetry.NodeSDK({
    resource: resource,
    textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()]
    }),
    traceExporter,
    metricReaders: [metricReader],
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-express': {},
            '@opentelemetry/instrumentation-http': {
                startIncomingSpanHook: (request) => {
                    return {
                        ["http.method"]: request.method,
                    }
                }
            },
            '@opentelemetry/instrumentation-winston': {
                logHook: (span, record) => {
                    record['resource.service.name'] = resource.attributes[ATTR_SERVICE_NAME];
                    record['resource.service.version'] = resource.attributes[ATTR_SERVICE_VERSION];
                    const currentBaggage = propagation.getActiveBaggage()

                    if (currentBaggage !== undefined) {
                        for(const key of ['client.id', 'user.id', 'graphql.operation', 'leav.attribute']) {
                            const baggageValue = currentBaggage.getEntry(key);
                            if(baggageValue !== undefined) {
                                record[key] = baggageValue.value;
                            }
                        }
                    }

                }
            }
        }) // liste des instrumentations supportées https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node
    ]
});


module.exports = sdk;
