const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: '-__v',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
