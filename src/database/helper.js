const { ObjectID } = require('mongodb');

const timeNow = () => Date.now();

const addUpdatedAtToModel = model => ({
  ...model,
  updatedAt: timeNow(),
});

const addCreatedAtToModel = model => ({
  ...model,
  createdAt: timeNow(),
});

const softDeleteRetrieveCondition = {
  deletedAt: null,
};

const convertToObjectID = (query) => {
  return {
    ...query,
    ...(query._id && { _id: ObjectID(query._id) }),
  };
};

exports.addUpdatedAtToModel = addUpdatedAtToModel;
exports.addCreatedAtToModel = addCreatedAtToModel;
exports.softDeleteRetrieveCondition = softDeleteRetrieveCondition;
exports.convertToObjectID = convertToObjectID;
