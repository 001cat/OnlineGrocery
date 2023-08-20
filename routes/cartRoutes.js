const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/myCart')
  .get(cartController.getMyCart)
  .patch(cartController.updateMyCart)
  .delete(cartController.clearMyCart);

// router.get('/checkout', cartController.getCheckoutSession);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(cartController.getAllOrders)
  .post(cartController.createOrder);
router
  .route('/:id')
  .get(cartController.getOrder)
  .patch(cartController.updateOrder)
  .delete(cartController.deleteOrder);

module.exports = router;
