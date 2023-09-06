require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const { body, validationResult } = require('express-validator')


//Get all users
exports.allUsers = async function(req, res, next) {
    const allUsers = await User.find({}, {_password: 0, _id: 0}).sort({username: -1}).exec()

    if (allUsers.length === 0) {
        const err = new Error('Database returns no users')
        res.json(err)
    } else {
        res.json(allUsers)
    }
}

//login
exports.login = async function(req, res, next) {

}

//signup
exports.signup = [
    body('username', 'Username must be at least 3 characters')
        .trim()
        .escape()
        .isLength({min: 3})
        .isAlphanumeric()
        .withMessage('Username: No Special Characters'),
    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Please enter valid email'),
    body('password')
        .trim()
        .escape()
        .isStrongPassword({})
        .withMessage('Please review password requirements'),
    body('checkPW')
        .trim()
        .escape()
        .custom(async (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match')
            }
            return true
        }),

    async (req, res, next) => {
        //validation errors
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() })
        }

        const { username, email, password, checkPW } = req.body

        //check if user exists
        const checkUser = await User.findOne({ username: username })
        if (checkUser) {
            return res.status(409).json({ error: 'Username taken' })
        }
        if (password !== checkPW) {
            return res.status(401).json({ error: 'Passwords must match' })
        }

        //create user
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return next(err)

            const newUser = new User({
                username: username,
                email: email,
                password: hash
            })
            await newUser.save()
            //add in jwt here, return a token


            return res.status(200).json({
                token,
                user: {
                    _id: newUser._id,
                    username: newUser.username
                },
                message: 'Success'
            })
        })
    }
]

//user page
exports.userDetail = async (req, res, next) => {
    User.findById(req.params.userID, (err, user) => {
        if (err) res.json(err)

        res.json(user)
    } )
}