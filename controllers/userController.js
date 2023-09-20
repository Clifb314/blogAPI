require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//Get all users
exports.allUsers = async function (req, res, next) {
  const allUsers = await User.find(
    {},
    { _password: 0, _id: 0, email: 0, status: 0 }
  )
    .sort({ username: -1 })
    .exec();

  if (allUsers.length < 1) {
    //const err = new Error("Database returns no users");
    res.json({ error: "Database returns no users" });
  } else {
    res.json({ users: allUsers, message: "success" });
  }
};

//login
exports.login = function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Incorrect password or username",
        user,
        err,
        body: req.body.username,
      });
    }
    //token generation
    jwt.sign(
      {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      { expiresIn: "10m", issuer: "CB" },
      (err, token) => {
        if (err) return res.status(400).json(err);
        res.json({
          token,
          user: {
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
          },
          message: "Signed in",
        });
      }
    );
  })(req, res);
};

//signup
exports.signup = [
  body("username", "Username must be at least 3 characters")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .isAlphanumeric()
    .withMessage("Username: No Special Characters"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Please enter valid email"),
  body("password").trim().escape(),
  //.isStrongPassword({})
  //.withMessage("Please review password requirements"),
  body("checkPW")
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),

  async (req, res, next) => {
    //validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { username, email, password, checkPW } = req.body;

    //check if user exists
    const checkUser = await User.findOne({ username: username });
    if (checkUser) {
      return res.status(409).json({ error: "Username taken" });
    }
    if (password !== checkPW) {
      return res.status(401).json({ error: "Passwords must match" });
    }
    //create user
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) return next(err);

      const newUser = new User({
        username: username,
        email: email,
        _password: hash,
      });
      console.log(newUser);
      await newUser.save();
      //add in jwt here, return a token
      const { _id, isAdmin } = newUser;
      jwt.sign(
        { _id, username, isAdmin },
        process.env.SECRET,
        { expiresIn: "5m", issuer: "CB" },
        (err, token) => {
          if (err) return next(err);

          return res.status(200).json({
            token,
            user: { _id, username, isAdmin },
            message: "Success",
          });
        }
      );
    });
  },
];

//user page
exports.userDetail = [
  (req, res, next) => {
    jwt.verify(
      req.token,
      process.env.SECRET,
      { issuer: "CB" },
      function (err, decoded) {
        if (err) return res.status(401).json(err);
        req.decoded = decoded;
        next();
      }
    );
  },

  async (req, res, next) => {
    //should validate first
    const user = await User.findById(req.params.userID)
      .select({ _password: 0, email: 0, status: 0 })
      .populate({
        path: "messages",
        sort: { date: -1 },
        limit: 5,
      })
      .exec();

    if (!user) return res.status(400).json({ message: "user not found" });

    return res.json(user);
  },
];

exports.myHome = [
  (req, res, next) => {
    jwt.verify(
      req.token,
      process.env.SECRET,
      { issuer: "CB" },
      function (err, decoded) {
        if (err) return res.status(401).json(err);
        req.decoded = decoded;
        next();
      }
    );
  },

  async (req, res, next) => {
    const myID = req.decoded._id;
    if (!myID)
      return res
        .status(401)
        .json({ error: "Must be logged in to access this page" });
    const myUser = await User.findById(myID, '-_password')
      .populate({
        path: "messages",
        sort: { date: -1 },
        limit: 5,
      })
      .exec();

    if (!myUser) return res.status(400).json({ message: "User not found" });
    else return res.json(myUser);
  },
];

exports.editSelf = [
  //validate token
  (req, res, next) => {

  },
  //sanitize input
  body("username", "Username must be at least 3 characters")
  .trim()
  .escape()
  .isLength({ min: 3 })
  .isAlphanumeric()
  .withMessage("Username: No Special Characters"),
body("email")
  .trim()
  .escape()
  .isEmail()
  .withMessage("Please enter valid email"),
body("password").trim().escape(),
//.isStrongPassword({})
//.withMessage("Please review password requirements"),
body("checkPW")
  .trim()
  .escape()
  .custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),

  async (req, res, next) => {
    const myID = req.decoded._id
    if (!myID) return res.status(401).json({error: 'Access denied'})
    const { username, email, password } = req.body
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return next(err)
      const editedUser = {
        username,
        email,
        _password: hash,
      }
      await User.findByIdAndUpdate(myID, editedUser).exec()
      return res.json({message: `${username} editted successfully`})
    })
  }
]
