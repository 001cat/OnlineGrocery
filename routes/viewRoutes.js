const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(viewController.setCSP);
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-cart', authController.protect, viewController.getCart);
router.get(
  '/delivery-address',
  authController.protect,
  viewController.getDeliveryAddress,
);
router.get(
  '/my-orders',
  authController.protect,
  orderController.createOrderUnsafe,
  viewController.getOrders,
);
router.get('/preparing', viewController.preparing);

module.exports = router;
