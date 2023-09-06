const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    _password: {type: String, required: true},
    email: {type: String, required: true},
    messages: [{type: Schema.Types.ObjectId, ref: 'msgModel'}],
    votes: {type: Number, default: 0},
    status: {type: Number, default: -1},
})




module.exports = mongoose.model('userModel', userSchema)