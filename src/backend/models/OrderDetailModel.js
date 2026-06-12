import mongoose from 'mongooes'

const orderDetailSchema = new mongoose.Schema({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  link_id: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
    required: [true, 'Product (link) is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  detail_status: {
    type: String,
    required: [true, 'Detail status is required'],
    enum: ['accepted', 'pending', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  request_date: {
    type: Date,
    required: [true, 'Request date is required'],
    default: Date.now
  }
}, { timestamps: true });

export default new mongoose.model('OrderDetail', orderDetailSchema);
