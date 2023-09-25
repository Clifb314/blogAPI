const mongoose = require('mongoose')
const Schema = mongoose.Schema


const msgSchema = new Schema({
    title: {type: String, default: ''},
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'userModel'},
    date: {type: Date, required: true, default: new Date()},
    comments: [{type: Schema.Types.ObjectId, ref: 'commentModel'}],
    likes: [{type: Schema.Types.ObjectId, ref: 'userModel'}]
})

msgSchema.virtual('easyDate').get(function() {
    return this.date.toLocaleString()
})

msgSchema.virtual('countLikes').get(function() {
    return this.likes.length + 1
})

msgSchema.virtual('countComments').get(function() {
    return this.comments.length + 1
})

module.exports = mongoose.model('msgModel', msgSchema)