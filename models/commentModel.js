import mongoose from "mongoose";
const Schema = mongoose.Schema


const commentSchema = new Schema({
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId},
    parent: {type: Schema.Types.ObjectId},
    date: {type: Date, required: true, default: new Date()}
})


commentSchema.virtual('easyDate').get(function() {
    return this.date.toLocaleDateString()
})