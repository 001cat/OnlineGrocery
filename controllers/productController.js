const Product = require('../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const getSuggests = require('./recommand');

exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getSuggests = catchAsync(async (req, res, next) => {
  const products = Product.find();
  let suggests = [];
  if (res.locals.user) {
    suggests = await getSuggests(res.locals.user.id, products);
  }
  res.status(200).json({
    status: 'success',
    result: suggests.length,
    data: {
      suggests,
    },
  });
});
