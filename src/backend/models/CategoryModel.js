import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  }
}, { timestamps: true });

export default new mongoose.model('Category', categorySchema);
