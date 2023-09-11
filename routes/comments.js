const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

// /comments/:postID/
//All comments
router.get('/', commentController.allComments)


//Create comment
router.post('/create', commentController.createComment)

//Edit comment
router.put('/:commentID/edit', commentController.editComment)

//Delete comment
router.delete('/:commentID/delete', commentController.deleteComment)

//comment detail
router.get('/:commentID', commentController.commentDetail)