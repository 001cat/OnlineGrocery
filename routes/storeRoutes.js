const express = require('express');
const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router
  .route('/')
  .get(storeController.getAllStores)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    storeController.createStore,
  );

router
  .route('/:id')
  .get(storeController.getStore)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    imageController.uploadImages,
    imageController.resizeImages,
    storeController.updateStore,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    storeController.deleteStore,
  );

module.exports = router;
