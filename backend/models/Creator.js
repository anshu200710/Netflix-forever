import mongoose from'mongoose';


const CreaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // used as subdomain
    createdAt: { type: Date, default: Date.now },
})

const Creater = mongoose.model('creator', CreaterSchema);
export default Creater;