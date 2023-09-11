const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')



//All posts
router.get('/', postController.showPosts)

//create new post
router.post('/create', postController.createPost)

//update post
router.put('/:postID/update', postController.updatePost)

//delete post
router.delete('/:postID/delete', postController.deletePost)

//like and dislike
router.put('/:postID/like', postController.likePost)
router.put('/:postID/dislike', postController.dislikePost)

//post detail
router.get('/:postID')



module.exports = router