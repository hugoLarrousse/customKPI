const winston = require('winston');

const myFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`);

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: (new Date(), 'DD/MM/YYYY hh:mm:ss') }),
    myFormat,
  ),
});

const colorizer = winston.format.colorize();

const createLabel = ({
  level,
  filename = '',
  methodName = '',
  message = '',
}) => `
${filename && `${colorizer.colorize(level, 'filename')}: ${filename}\n`}${methodName && `${colorizer.colorize(level, 'methodName')}: ${methodName}`}${message && `\n${colorizer.colorize(level, 'message')}: ${message}\n`}`; //eslint-disable-line

const warning = (args) => {
  logger.warn(createLabel({ level: 'warn', ...(typeof args === 'string' ? { message: args } : args) }));
};

const error = (args) => {
  logger.error(createLabel({ level: 'error', ...(typeof args === 'string' ? { message: args } : args) }));
};

const info = (args) => {
  logger.info(createLabel({ level: 'info', ...(typeof args === 'string' ? { message: args } : args) }));
};

exports.info = info;
exports.error = error;
exports.warning = warning;
