const Message = require('../models/msgModel')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

exports.showPosts = async function(req, res, next) {
    Message.find({}).populate('author').sort({date: -1}).exec((err, posts) => {
        if (err) return res.json(err)

        return res.json(posts)
    })
}

exports.createPost = [
    //validate token



    //validate input
    body('title').trim().escape(),
    body('content').trim().isLength({min: 1}).escape(),

    async (res, req, next) => {
        const errors = validationResult(req.body)
        const { title, content } = req.body

        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() })
        }
        const newPost = new Message({
            title,
            content,
            date: new Date(),
            author: '', //will get from token
            comments: [],
        })
        await newPost.save()
        return res.json(newPost)
    }
]

exports.updatePost = [
    body('title').trim().escape(),
    body('content').trim().isLength({min: 1}).escape(),

    async (res, req, next) => {
        const errors = validationResult(req.body)
        const { title, content } = req.body
        if (!errors.isEmpty()) {
            return res.json({errors: errors.array()})
        }
        const newPost = await Message.findByIdAndUpdate(req.params.id, {title: title, content: content}, {new: true}).exec()
        return res.json(newPost)
    }
]

exports.deletePost = async (req, res, next) => {
    //verify token



    await Message.findByIdAndDelete(req.params.id, function(err) {
        if (err) return res.json(err)

        res.json({ message: 'Post deleted' })
    })
}

exports.likePost = async (req, res, next) => {
    //get user from token?
    const user = undefined
    //check if user liked the post already, if not, push the like to likes array
    const post = await Message.findOneAndUpdate({_id: req.params.id, likes: {$nin: [user]}}, {$push: {likes: user}}, {new: true}).exec()


    return res.json(post)


}

exports.postDetail = async (req, res, next) => {
    const myPost = await Message.findById(req.params.id).populate('author').exec()

    if (!myPost) return res.json({error: 'Post not found'})

    return res.json(post)
}