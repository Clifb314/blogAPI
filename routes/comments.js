const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

// /comments/:postID/

//Create comment
router.post('/msg/:postID/create', commentController.createComment)

//All comments of a post
router.get('/msg/:postID/', commentController.allComments)


//Edit comment
router.put('/:commentID/edit', commentController.editComment)

//Delete comment
router.delete('/:commentID/delete', commentController.deleteComment)

//comment detail
router.get('/:commentID', commentController.commentDetail)

module.exports = router