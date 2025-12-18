const winston = require("winston");
const process = require('process')
function level(loggerName){
    return 'debug'
}


function log(file) {
    const loggerName = file.replace(process.cwd(), '');
    return winston.createLogger({
        level: level(loggerName),
        defaultMeta: { logger: loggerName },
        transports: [new winston.transports.Console()],
    });
}


module.exports = log;