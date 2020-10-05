const fields = require('./fields');
const logger = require('../utils/logger');
const Users = require('../modules/users');

const checkFields = (req, res, next) => {
  const fieldsByRoute = fields[`${req.method.toLowerCase()}${req.baseUrl}${req.route.path.length > 1 ? req.route.path : ''}`];
  if (!fieldsByRoute) return next();
  const fieldsToCheck = Object.keys({ ...req.body, ...req.params, ...req.query });
  for (const fieldByRoute of fieldsByRoute) {
    if (!fieldsToCheck.includes(fieldByRoute)) {
      logger.error({ filename: __filename, methodName: 'checkFields', message: `fields are missing, ${req.method}${req.baseUrl}${req.route.path}` });
      return res.status(400).send({ success: false, message: `field: ${fieldByRoute} is missing` });
    }
  }
  return next();
};

const checkToken = async (req, res, next) => {
  const token = req.headers.api_token;
  try {
    if (!token) throw Error('no token provided');
    const user = await Users.getUserByToken(token);
    if (!user) throw Error('wrong token');
    req.user = user;
    next();
  } catch (error) {
    logger.error({ filename: __filename, methodName: 'checkToken', message: `${req.method}${req.baseUrl}, message: ${error.message}` });
    res.status(403).send({ success: false, message: 'ERROR_TOKEN' });
  }
};

exports.checkFields = checkFields;
exports.checkToken = checkToken;
