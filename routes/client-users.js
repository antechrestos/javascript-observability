const express = require('express');
const createError = require('http-errors');
const log = require('../log');
const {context, propagation, baggage, ROOT_CONTEXT} = require('@opentelemetry/api');

const router = express.Router();


const logger = log(__filename);

const apiUrl = "http://localhost:8080";
/* GET users listing. */
router.get('/', function (req, res) {
    context.with(propagation.setBaggage(context.active(), req.baggage), () => {
        logger.debug('Calling API to list users')
        fetch(`${apiUrl}/api/users`, {
            headers: {
                Accept: "application/json",
            },
        }).then(response => response.json())
            .then(data => {
                res.header('Content-Type', 'application/json');
                res.send(data);
                logger.debug('API to list users called')
            });
    });
});


router.get('/:id', function (req, res, next) {
    const id = req.params.id
    logger.debug('Get user by id ' + id)
    fetch(`${apiUrl}/api/users/${id}`, {
        headers: {
            Accept: "application/json",
        },
    }).then(response => {
        if (response.status !== 200) {
            next(createError(status));
        } else {
            return response.json();
        }
    })
        .then(data => {
            res.header('Content-Type', 'application/json');
            res.send(data);
        });

});

module.exports = router;
