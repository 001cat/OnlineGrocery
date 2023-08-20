const mongoose = require('mongoose');
const slugify = require('slugify');
// const Store = require('./storeModel');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name!'],
      trim: true,
      maxlength: [
        40,
        'A product name must have less or equal than 40 characters',
      ],
    },
    slug: String,
    price: { type: Number, required: [true, 'A product must have a price!'] },
    unitInLB: { type: Boolean, default: false },
    description: { type: String, trim: true },
    nutrition100g: {
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      fiber: { type: Number, required: true },
      sugars: { type: Number, required: true },
      water: { type: Number, required: true },
    },
    images: [String],
    // storeName: {
    //   type: String,
    //   required: [true, 'A product must belong to a store!'],
    // },
    // storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// productSchema.index({ storeId: 1 });
// productSchema.index({ storeId: 1, name: 1 }, { unique: true });

productSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  // const store = await Store.findOne({ name: this.storeName });
  // this.storeId = store._id;
  next();
});
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'storeId',
//     select: '-__v',
//   });
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
