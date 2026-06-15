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
    notes: {
        type: String
    }
}, { timestamps: true });

export default new mongoose.model('RequestDetail', requestDetailSchema);
