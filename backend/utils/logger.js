const { createLogger, format, transports } = require('winston');
const path = require('path');

const format1 = format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format1
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, '../../app.log') }),
        new transports.Console()
    ],
});

module.exports = logger;