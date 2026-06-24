import mongoose from 'mongoose';


const LinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "empty link"],
        trim: true,
        default: ""
    },
    name: {
        type: String,
        required: [true, "empty name in link"],
        trim: true,
        default: ""
    },
    quantity: {
        type: Number,
        required: [true, "no quantity in link"],
        default: 1
    }
});

export default LinkSchema;
