const express = require('express');

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protect);
router.route('/myOrders').get(orderController.getMyOrders);
// .post(orderController.createMyOrder);
router.get('/checkout-session', orderController.getCheckoutSessionUnsafe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);
router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
