const Comment = require('../models/commentModel')
const Message = require('../models/msgModel')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.allComments = async (req, res) => {
    const allComments = await Comment.find({}).sort({date: -1}).populate('author').exec()

    if (allComments.length === 0) {
        return res.json({error: 'No comments found'})
    }
    return res.json(allComments)
}

exports.createComment = [
    //validate input
    body('author').trim().isLength({min: 1}).withMessage('Username is required').escape(),
    body('content').trim().isLength({min: 1}).withMessage('Comment cannot be empty').escape(),

    async (req, res) => {
        const errors = validationResult(req.body)
        //will pass parent post ID as a hidden input
        const { author, content, parent } = req.body

        if (!errors.isEmpty()) return res.json(errors.array())

        const newComment = new Comment({
            author,
            content,
            parent,
            date: new Date(),
        })
        await newComment.save()
        await Message.findByIdAndUpdate(parent, {$push: {comments: newComment._id}})
        return res.json(newComment)
    }
]

exports.editComment = [
    //validate token
    jwt.verify(req.token, process.env.SECRET, {issuer: 'CB', }, function(err, decoded) {
        if (err) return res.status(400).json(err)
        req.decoded = decoded
        next()
    }),

    //validate input
    body('author').trim().isLength({min: 1}).withMessage('Username is required').escape(),
    body('content').trim().isLength({min: 1}).withMessage('Comment cannot be empty').escape(),

    async (req, res, next) => {
        const errors = validationResult(req.body)
        //will pass date, parent, id as hidden inputs
        //parent can also come from req.params.postID
        const { author, content, date, parent, id } = req.body

        if (!errors.isEmpty()) return res.json(errors.array())
        const update = {
            author,
            content,
            date,
            parent,    
        }
        const newComment = await Comment.findByIdAndUpdate(id, update, {new:true}).exec()
        return res.json(newComment)
    }
]

exports.deleteComment = async (req, res, next) => {
    await Comment.findByIdAndRemove(req.params.commentID, function(err) {
        if (err) return res.json(err)

        return res.json({message: 'Comment deleted'})
    })
}

exports.commentDetail = async (req, res) => {
    const myComment = Comment.findById(req.params.commentID)

    if (!myComment) return res.json({error: 'Comment not found in database'})

    return res.json(myComment)
}