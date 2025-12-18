const usersRouter = require('./routes/users');
const buildApp = require('./app');
const apiUserPath = '/api/users';
const api = buildApp('api', false, {[apiUserPath]: usersRouter});

module.exports = api;
