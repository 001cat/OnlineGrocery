const express = require('express');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const storeRouter = require('./routes/storeRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
// app.use(cors({ origin: /localhost:[0-9]*/, credentials: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    headers: 'Origin, X-Requested-With, Content-Type, Accept',
    credentials: true,
  }),
);
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// Body and cookie parser, reading data from body cookies into req.body and req.cookies
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(express.static(`${__dirname}/public`)); // Servering static files
app.use('/', viewRouter);

// app.use(express.static(`${__dirname}/dist`));
// app.get('*', (req, res) => {
//   res.sendFile(`${__dirname}/dist/index.html`);
// });

// Api routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/carts', cartRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
