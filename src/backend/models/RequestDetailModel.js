import mongoose from 'mongoose'

import Link from './LinkModel.js'
import Request from './RequestModel.js'
import Country from './CountryModel.js'
import Category from './CategoryModel.js'


const requestDetailSchema = new mongoose.Schema({
    link_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: [true, "must have some link id"]
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: [true, "must have some requester"]
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    tax_rate: {// from country_id, category_id, Tax
        type: Number,
    },
    base_price: {
        type: Number,
    },
    int_shipping: { // from country_id
        type: Number,
    },
    dom_shipping: {
        type: Number,
    },
    charge: { // platform fee, frozen at quote time so later CHARGE changes don't affect it
        type: Number,
    },
    total_price: { // base_price * (1 + tax_rate/100) + int_shipping + dom_shipping + charge, frozen at quote time
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending','accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export default new mongoose.model('RequestDetail', requestDetailSchema);
