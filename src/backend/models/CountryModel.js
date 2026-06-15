import mongoose from 'mongoose';

const CountryCurrencies = {
    NEPAL: "NPR",
    INDIA: "INR",
    CHINA: "YUAN",
    INVALID: "INVALID"
}

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Country name is required'],
        unique: true,
        trim: true
    },
    domestic_currency: {
        type: String,
        enum: Object.values(CountryCurrencies),
        required: [true, 'Domestic currency is required'],
        default: CountryCurrencies.INDIA
    },
    shipping:{
        type: Number,
        required: [true, 'must have international shipping cost']
    }
}, { timestamps: true });

export default new mongoose.model('Country', countrySchema);
