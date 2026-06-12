import mongoose from 'mongooes'


const paymentSchema = new mongoose.Schema({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required'],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  payment_method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['eSewa', 'Khalti', 'card', 'cash'],
    default: 'eSewa'
  },
  transaction_uuid: {
    type: String,
    required: [true, 'Transaction UUID is required'],
    unique: true
  },
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['completed', 'pending', 'failed'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now
  }
}, { timestamps: true });

export default new mongoose.model('Payment', paymentSchema);
