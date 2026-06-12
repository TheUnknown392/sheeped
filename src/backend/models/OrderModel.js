import mongoose from 'mongooes'

const orderSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User (buyer) is required']
  },
  payment_id: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Payment is required']
  },
  order_date: {
    type: Date,
    required: [true, 'Order date is required'],
    default: Date.now
  },
  status: {
    type: String,
    required: [true, 'Order status is required'],
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  items_summary: {
    type: [orderItemSchema],
    default: []
  }
}, { timestamps: true });

export default new mongoose.model('Order', orderSchema);
