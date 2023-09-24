const mongoose = require('mongoose')
const Schema = mongoose.Schema


const commentSchema = new Schema({
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId},
    parent: {type: Schema.Types.ObjectId, ref: 'msgModel'},
    date: {type: Date, required: true, default: new Date()}
})


commentSchema.virtual('easyDate').get(function() {
    return this.date.toLocaleDateString()
})

module.exports = mongoose.model('commentModel', commentSchema)