import mongoose from 'mongoose'

import Country from './CountryModel.js'
import Category from './CategoryModel.js'

const taxSchema = new mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'must have some country']
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'must have some category']
    },
    Tax_per: {
        type: Number,
        required: [true, 'must have some tax percent'],
        default: 0.13
    }
}, { timestamps: true });

export default new mongoose.model('Tax', taxSchema);
