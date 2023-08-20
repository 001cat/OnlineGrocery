const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOrder = factory.getOne(Cart);
exports.getAllOrders = factory.getAll(Cart);
exports.createOrder = factory.createOne(Cart);
exports.updateOrder = factory.updateOne(Cart);
exports.deleteOrder = factory.deleteOne(Cart);

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.user.cartId);

  if (!cart) return next(new AppError('No cart found with that ID', 404));

  res.status(200).json({
    stats: 'Success',
    data: cart,
  });
});

exports.updateMyCart = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const cart = await Cart.findByIdAndUpdate(req.user.cartId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cart) return next(new AppError('No cart found with that ID', 404));

  res.status(200).json({
    stats: 'Success',
    data: cart,
  });
});

exports.clearMyCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(
    req.user.cartId,
    { items: [] },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!cart) return next(new AppError('No cart found with that ID', 404));

  res.status(200).json({
    stats: 'Success',
    data: cart,
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the products in my cart
  const cart = await Cart.findById(req.user.cartId);
  const items = cart.items.map((el) => ({
    quantity: el.quantity,
    price_data: {
      product_data: {
        name: el.product.name,
        images: el.product.images,
      },
      unit_amount: el.product.price * 100,
      currency: 'usd',
    },
  }));

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    //UNSAFE TEMPORARY SOLUTION TODO: change success_url and cancel_url
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    // cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: items,
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
