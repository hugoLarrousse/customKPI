const { MongoClient } = require('mongodb');
const config = require('config');

const {
  addUpdatedAtToModel, addCreatedAtToModel, softDeleteRetrieveCondition, convertToObjectID,
} = require('./helper');
const logger = require('../utils/logger');

let mongodbConnect = null;

const createConnection = async () => {
  try {
    mongodbConnect = await MongoClient.connect(process.env.dbServer,
      { poolSize: config.get('poolSize') || 80, useNewUrlParser: true, useUnifiedTopology: true });
    return 1;
  } catch (e) {
    logger.error({ filename: __filename, methodName: createConnection.name, message: e.message });
    return 0;
  }
};

const closeConnection = async () => mongodbConnect && mongodbConnect.close();

const insertOne = async (databaseName, collectionName, doc) => {
  const docToSave = addCreatedAtToModel(doc);
  const response = await mongodbConnect.db(databaseName).collection(collectionName).insertOne(docToSave);
  return response.ops.length > 0 && response.ops[0];
};

const updateOne = async (databaseName, collectionName, query = {}, doc, options = {}, noNeedSet) => {
  const docToUpdate = noNeedSet ? doc : { $set: addUpdatedAtToModel(doc) };
  const docUpdated = await mongodbConnect.db(databaseName).collection(collectionName)
    .findOneAndUpdate(
      {
        ...(query && convertToObjectID(query)),
        ...softDeleteRetrieveCondition,
      },
      docToUpdate,
      {
        ...options,
        returnOriginal: false,
      },
    );
  return docUpdated.value;
};

const findOne = (databaseName, collectionName, query = {}, deleted) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .findOne({ ...!deleted && softDeleteRetrieveCondition, ...(query && convertToObjectID(query)) });
};

const find = async (databaseName, collectionName, query = {}, sort = {}, limit = 0, offset = 0, deleted) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .find({
      ...!deleted && softDeleteRetrieveCondition,
      ...(query && convertToObjectID(query)),
    })
    .sort(sort)
    .limit(Number(limit))
    .skip(Number(offset))
    .toArray();
};

const softDeleteOne = async (databaseName, collectionName, query = {}) => {
  return updateOne(databaseName, collectionName, query, { deletedAt: Date.now() });
};

exports.createConnection = createConnection;
exports.closeConnection = closeConnection;

exports.insertOne = insertOne;

exports.updateOne = updateOne;

exports.findOne = findOne;
exports.find = find;

exports.softDeleteOne = softDeleteOne;
