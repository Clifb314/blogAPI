const Message = require("../models/msgModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.showPosts = async function (req, res, next) {
  Message.find({})
    .populate("author")
    .sort({ date: -1 })
    .limit(15)
    .exec((err, posts) => {
      if (err) return res.json(err);

      return res.json(posts);
    });
};

exports.createPost = [
  //validate token
  jwt.verify(
    req.token,
    process.env.SECRET,
    { issuer: "CB" },
    function (err, decoded) {
      if (err) return res.status(400).json(err);
      console.log(decoded);
      req.decoded = decoded;
      next();
    }
  ),

  //validate input
  body("title").trim().escape(),
  body("content").trim().isLength({ min: 1 }).escape(),

  async (res, req, next) => {
    const errors = validationResult(req.body);
    const { title, content } = req.body;

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const newPost = new Message({
      title,
      content,
      date: new Date(),
      author: req.decoded._id, //will get from token or will have to find from db
      comments: [],
    });
    await newPost.save();
    return res.json(newPost);
  },
];

exports.updatePost = [
  body("title").trim().escape(),
  body("content").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req.body);
    const { title, content } = req.body;
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const newPost = await Message.findByIdAndUpdate(
      req.params.postID,
      { title: title, content: content },
      { new: true }
    ).exec();
    if (newPost === null) return res.json({error: 'Update failed'})

    return res.json(newPost);
  },
];

exports.deletePost = async (req, res, next) => {
  //verify token

  (req, res, next) => {
    jwt.verify(
      req.token,
      process.env.SECRET,
      { issuer: "CB" },
      function (err, decoded) {
        if (err) return res.status(400).json(err);
        req.decoded = decoded;
        next();
      }
    );
  },
    await Message.findByIdAndDelete(req.params.postID, function (err) {
      if (err) return res.json(err);

      res.json({ message: "Post deleted" });
    });
};

exports.likePost = async (req, res, next) => {
  //get user from token?
  const payload = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
  const user = payload._id;
  //check if user liked the post already, if not, push the like to likes array
  const post = await Message.findOneAndUpdate(
    { _id: req.params.postID, likes: { $nin: [user] } },
    { $push: { likes: user } },
    { new: true }
  ).exec();

  if (post === null) return res.json({ error: `Failed to like post` });

  return res.json(post);
};

exports.dislikePost = async (req, res, next) => {
  const payload = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
  const user = payload._id;

  const post = await Message.findOneAndUpdate(
    { _id: req.params.postID, likes: user },
    { $pull: { likes: user } },
    { new: true }
  ).exec();

  if (post === null) return res.json({ error: `Failed to dislike post` });

  return res.json(post);
};

exports.postDetail = async (req, res, next) => {
  const myPost = await Message.findById(req.params.postID)
    .populate("author")
    .exec();

  if (!myPost) return res.json({ error: "Post not found" });

  return res.json(post);
};
