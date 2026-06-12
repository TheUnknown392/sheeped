import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
    trim: true,
    minlength: [3, 'firstName must be at least 3 characters'],
    maxlength: [30, 'firstName cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'],
    trim: true,
    minlength: [2, 'lastName must be at least 2 characters'],
    maxlength: [30, 'lastName cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['buyer', 'admin'],
    default: 'buyer'
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: null
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default new mongoose.model('User', userSchema);

