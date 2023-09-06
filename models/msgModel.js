import mongoose from "mongoose";
const Schema = mongoose.Schema


const msgSchema = new Schema({
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'userModel'},
    date: {type: Date, required: true, default: new Date()},
    comments: [{type: Schema.Types.ObjectId, ref: 'commentModel'}],
})

msgSchema.virtual('easyDate').get(function() {
    return this.date.toLocaleString()
})

module.exports = mongoose.model('msgModel', msgSchema)