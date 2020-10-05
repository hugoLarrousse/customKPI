const logger = require('./logger');

module.exports = (err, req, res, next) => { //eslint-disable-line
  try {
    if (!err) throw Error('error is missing');
    if (typeof err !== 'string') throw Error(err);
    const tabError = err.split('| ');
    if (!tabError) throw Error(tabError);
    if (tabError.length === 1) {
      logger.error(tabError[0]);
    } else {
      logger.error({ filename: tabError[0], methodName: tabError[1], message: tabError[2] });
    }
    res.status(400).send({ success: false, error: true, message: tabError[3] || 'error' });
  } catch (e) {
    logger.error({ filename: __filename, methodName: 'handle errors', message: e.message });
    res.status(400).send({ success: false, error: true, message: 'error unknown' });
  }
};
