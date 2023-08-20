const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        product: {
          name: {
            type: String,
            required: [true, 'A product must have a name!'],
            trim: true,
            maxlength: [
              40,
              'A product name must have less or equal than 40 characters',
            ],
          },
          price: {
            type: Number,
            required: [true, 'A product must have a price!'],
          },
          unitInLB: { type: Boolean, default: false },
          nutrition100g: {
            protein: { type: Number, required: true },
            fat: { type: Number, required: true },
            fiber: { type: Number, required: true },
            sugars: { type: Number, required: true },
            water: { type: Number, required: true },
          },
          images: [String],
        },
        quantity: Number,
      },
    ],
    orderedAt: { type: Date, default: Date.now() },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      addLine1: { type: String, required: true },
      addLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    status: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
      enum: {
        values: ['unpaid', 'paid', 'delivered'],
        message: 'Status is either: unpaid, paid, delivered',
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

orderSchema.index({ userId: 1 });

// orderSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'items.product',
//     select: '-__v',
//   });
//   next();
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
