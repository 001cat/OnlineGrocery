const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const getSuggests = require('./recommand');

exports.setCSP = (req, res, next) => {
  res.set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com http://localhost ws://localhost:* ws://127.0.0.1:* https://js.stripe.com;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
  );
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  const products = await Product.find();
  let suggests;
  if (res.locals.user) {
    suggests = await getSuggests(res.locals.user.id, products);
  }
  res.status(200).render('overview', {
    title: 'All products',
    products,
    suggests,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your acount',
  });
};

exports.preparing = (req, res) => {
  res.status(200).render('error', {
    title: 'Inpreparing',
    msg: 'This page is still in preparing',
  });
};

exports.getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.user.cartId);
  res.status(200).render('shoppingCart', {
    title: 'My shopping cart',
    cart,
  });
});

exports.getDeliveryAddress = catchAsync(async (req, res) => {
  res.status(200).render('deliveryAddress', {
    title: 'My shopping cart',
    user: req.user,
    address: req.user.address,
  });
});

exports.getOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.status(200).render('orders', {
    title: 'My orders',
    orders,
  });
});
