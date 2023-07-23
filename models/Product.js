const { Schema, model, Types } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide name'],
      maxLength: [100, 'Name can not be more than 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      default: 0
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxLength: [100, 'Description can not be more than 100 characters']
    },
    image: { type: String, default: '/uploads/example.jpg' },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedrom']
    },
    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported'
      }
    },
    colors: { type: [String], required: true, default: '#222' },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: {
      type: Number,
      required: true,
      default: 15
    },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true, toObject: { virtuals: true } } }
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

ProductSchema.pre('remove', async function (_next) {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = model('Product', ProductSchema);
