import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true
  },
  domestic_currency: {
    type: String,
    required: [true, 'Domestic currency is required'],
    enum: ['NPR', 'INR', 'USD', 'YUAN'],
    default: 'NPR'
  },
  tax_rate: {
    type: Number,
    required: [true, 'Tax rate is required'],
    min: [0, 'Tax rate cannot be negative'],
    max: [1, 'Tax rate cannot exceed 100%']
  }
}, { timestamps: true });

export default new mongoose.model('Country', countrySchema);
