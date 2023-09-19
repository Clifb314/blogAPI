var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', userController.allUsers);

//log in
router.post('/login', userController.login)

//account page

//test page
router.post('/test', userController.test)

//sign in
router.post('/signup', userController.signup)


//user detail
router.get('/:userID', userController.userDetail)

module.exports = router;
