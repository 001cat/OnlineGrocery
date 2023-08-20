const express = require('express');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const storeRouter = require('./routes/storeRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// Body and cookie parser, reading data from body cookies into req.body and req.cookies
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`)); // Servering static files

// Website routes
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

/////
// const authController = require('./controllers/authController');
// const Product = require('./models/productModel');
// const catchAsync = require('./utils/catchAsync');

// const router = express.Router();
// const setCSP = (req, res, next) => {
//   res.set(
//     'Content-Security-Policy',
//     "default-src 'self' https://*.mapbox.com http://localhost ws://localhost:* ws://127.0.0.1:* https://js.stripe.com;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
//   );
//   next();
// };
// const getOverview = catchAsync(async (req, res) => {
//   const products = await Product.find();
//   res.status(200).render('overview', {
//     title: 'All Tours',
//     products,
//   });
// });
// router.use(setCSP);
// router.get('/', authController.isLoggedIn, getOverview);
app.use('/', viewRouter);
/////

// Api routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/carts', cartRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
