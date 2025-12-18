const buildApp = require("./app");
const clientUsersRouter = require("./routes/client-users");
const userPath = '/users';
const bff = buildApp('bff', true, {[userPath]: clientUsersRouter});

module.exports = bff;
