import mongoose from 'mongoose'
import LinkSchema from './schema/LinkSchema.js'

export default mongoose.model("Link", LinkSchema);
