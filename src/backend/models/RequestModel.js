import mongoose from "mongoose"
import LinkSchema from "./schema/LinkSchema.js"


const RequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Must be logged']
    },
    links: {
        type: [LinkSchema],
        required: [true, 'no link in RequestSchema']
    },
    description: {
        type: String,
        required: [false, 'Description is required'],
    }
}, { timestamps: true });

export default new  mongoose.model('Request', RequestSchema);
