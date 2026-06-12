import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  tax_rate: {
    type: Number,
    required: [true, 'Tax rate is required'],
    min: [0, 'Tax rate cannot be negative'],
    max: [1, 'Tax rate cannot exceed 100%'],
    default: 0.13
  },
  country_id: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Country is required']
  }
}, { timestamps: true });

default export new mongoose.model('Category', categorySchema);
