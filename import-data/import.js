const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Product = require('../models/productModel');

dotenv.config({ path: `${__dirname}/../config.env` });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('DB connnection successful!');
});

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Product.create(products);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
};

deleteData()
  .then(() => importData())
  .then(() => process.exit());
