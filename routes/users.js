const express = require('express');
const createError = require('http-errors');
const log = require('../log');

const router = express.Router();

const UserDao = require('../dao/users-dao');

const userDao = new UserDao();

const logger = log(__filename);

let client = null;

require('../messaging').client('amqp://my-user:my-pass@localhost:5672/my-v-host', 'notification', (c) => {
    client = c;
});

/* GET users listing. */
router.get('/', async function (req, res) {
    logger.debug('List users')
    const users = await userDao.list();
    if(client){
        client('List users invoked');
    }
    res.header('Content-Type', 'application/json');
    res.send(users);
});

router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    logger.debug('Get user by id ' + id)
    const user = await userDao.getByName(id);
    if (user === null) {
        logger.warn('Erreur - l utilisateur n existe pas')
        next(createError(404));
    } else {
        res.header('Content-Type', 'application/json');
        res.send(user)
    }
});

module.exports = router;
