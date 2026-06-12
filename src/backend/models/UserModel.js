import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
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

export default new  mongoose.model('User', userSchema);

