var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', userController.allUsers);

//log in
router.post('/login', userController.login)

//edit account
router.put('/edit', userController.editSelf)

//account page
router.get('/home', userController.myHome)

//test page
//router.post('/test', userController.test)

//sign in
router.post('/signup', userController.signup)


//user detail
router.get('/:userID', userController.userDetail)

module.exports = router;
