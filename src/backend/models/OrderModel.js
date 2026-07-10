import mongoose from 'mongoose';

import CHARGE from '../utils/charge.js'

import User from './UserModel.js'

const DeliveryStatus = {
    PENDING: 'pending',
    DELIVERING: 'delivering',
    DELIVERED: 'delivered',
    FAILED: 'failed'
}

const OrderStatus = { // maybe make a different "verification" enum for accept and reject
    PENDING: 'pending',
    REFUNDING: 'refunding',
    FINISHED: 'finished',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    FAILED: 'failed'
}   
// todo: add payment_id and make new payment schema
const orderSchema = new mongoose.Schema({
    delivery_status: {
        type: String,
        enum: Object.values(DeliveryStatus),
        required: [true,'there should be delivery status'],
        default: DeliveryStatus.PENDING
    },
    order_status: {
        type: String,
        enum: Object.values(OrderStatus),
        required: [true,'there should be order status'],
        default: OrderStatus.PENDING
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'there should be user id for quick user access']
    },
    request_detail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RequestDetail',
        required: [true, 'order must trace back to the quote it came from']
    },
    charge: {
        type: Number,
        required: [true, 'no charge in orderSchema'],
        default: CHARGE
    }
}, { timestamps: true });

export default new mongoose.model('Order', orderSchema);
