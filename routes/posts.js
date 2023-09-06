const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')



//All posts
router.get('/', )

//create new post
router.post('/create', )

//update post
router.put('/:postID/update', )

//delete post
router.delete('/:postID/delete', )

//post detail
router.get('/:postID')



module.exports = router