const express = require("express");
const createError = require('http-errors');
const expressWinston = require("express-winston");
const winston = require("winston");
const {context, propagation, baggage, ROOT_CONTEXT} = require('@opentelemetry/api');



function buildApplication(name, initBagage, mapping){
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    if(initBagage){
        app.use((req, res, next) => {
            req.baggage = (propagation.getActiveBaggage() || propagation.createBaggage())
                .setEntry('client.id', {value: 'carrefour'})
                .setEntry('user.id', {value: 'some-user'})
                .setEntry('graphql.operation', {value: 'some-operation'})
                .setEntry('leav.attribute', {value: 'some-attribute'});
            next();
        })
    }
    for (const [key, value] of Object.entries(mapping)) {
        app.use(key, value);
    }

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.header('Content-Type', 'application/json');
        res.send({error: err.message});
    });

    return app;
}
module.exports = buildApplication;