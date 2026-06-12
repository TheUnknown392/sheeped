import mongoose from "mongoose"

const linkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: [true, 'Product link is required']
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller (user) is required']
  },
  country_id: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Country is required']
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  }
}, { timestamps: true });

export default new  mongoose.model('Link', linkSchema);
