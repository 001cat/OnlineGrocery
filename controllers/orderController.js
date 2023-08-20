const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.createOrder = factory.createOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id });

  if (!orders) return next(new AppError('No order found from this user.', 404));

  res.status(200).json({
    stats: 'Success',
    data: orders,
  });
});

//unsafe temporary solution
exports.getCheckoutSessionUnsafe = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.user.cartId);

  // eslint-disable-next-line camelcase
  const line_items = cart.items.map((el) => ({
    quantity: el.quantity,
    price_data: {
      product_data: { name: el.product.name, images: [el.product.images[0]] },
      unit_amount: el.product.price * 100,
      currency: 'usd',
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-orders/?userId=${
      req.user.id
    }`,
    cancel_url: `${req.protocol}://${req.get('host')}/my-cart`,
    customer_email: req.user.email,
    client_reference_id: req.user.cartId,
    mode: 'payment',
    // eslint-disable-next-line camelcase
    line_items,
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createOrderUnsafe = catchAsync(async (req, res, next) => {
  if (!req.query.userId || req.query.userId !== req.user.id) return next();
  const cart = await Cart.findById(req.user.cartId);
  const items = cart.items.map((el) => ({
    quantity: el.quantity,
    product: {
      name: el.product.name,
      price: el.product.price,
      unitInLB: el.product.unitInLB,
      nutrition100g: el.product.nutrition100g,
      images: el.product.images,
    },
  }));

  await Order.create({
    userId: req.query.userId,
    items,
    orderedAt: Date.now(),
    address: req.user.address,
    status: 'paid',
  });
  await Cart.findByIdAndUpdate(req.user.cartId, { items: [] });
  res.redirect(req.originalUrl.split('?')[0]);
  next();
});
