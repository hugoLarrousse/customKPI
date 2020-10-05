const config = require('config');

const database = require('../database');

const collectionName = config.get('collections.customKpi');
const { databaseName } = process.env;

const getAll = (orgaId) => database.find(databaseName, collectionName, { orgaId });

const getOne = (orgaId, kpiId) => database.findOne(databaseName, collectionName, { orgaId, id: kpiId });

const addValue = (orgaId, kpiId, value) => database.updateOne(databaseName, collectionName, { orgaId, id: kpiId },
  { $push: { values: { $each: [{ timestamp: Date.now(), value }], $position: 0 } } }, {}, true);

exports.getAll = getAll;
exports.getOne = getOne;
exports.addValue = addValue;
