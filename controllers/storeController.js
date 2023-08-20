const Store = require('../models/storeModel');
const factory = require('./handlerFactory');

exports.getStore = factory.getOne(Store);
exports.getAllStores = factory.getAll(Store);
exports.createStore = factory.createOne(Store);
exports.updateStore = factory.updateOne(Store);
exports.deleteStore = factory.deleteOne(Store);
