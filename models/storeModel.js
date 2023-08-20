const mongoose = require('mongoose');
const slugify = require('slugify');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A store must have a name!'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A store name must have less or equal than 40 characters',
      ],
    },
    slug: String,
    description: { type: String, trim: true },
    images: [String],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// storeSchema.index({ slug: 1 });

storeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model('Store', storeSchema);

module.exports = Product;
