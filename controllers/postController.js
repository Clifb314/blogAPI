const Message = require("../models/msgModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.showPosts = async function (req, res, next) {
  const allMessages = await Message.find({})
  //use projection to take password out of here
    .populate("author")
    .sort({ date: -1 })
    .limit(15)
    .exec();

  if (allMessages.length < 1) return res.json({error: 'No posts found on database'})

  return res.json(allMessages)
};

exports.topPosts = async function (req, res, next) {
  const allMessages = await Message.find({})
    .populate("author")
    .sort({ likes: -1 })
    .limit(15)
    .exec();

  if (allMessages.length < 1) return res.json({error: 'No posts found on database'})

  return res.json(allMessages)
};


exports.createPost = [
  //validate token
  (req, res, next) => {jwt.verify(
    req.token,
    process.env.SECRET,
    { issuer: "CB" },
    function (err, decoded) {
      if (err) return res.status(400).json(err);
      console.log(decoded);
      req.decoded = decoded;
      next();
    }
  )},

  //validate input
  body("title").trim().escape(),
  body("content").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
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
    //need to push id to User
    await newPost.save();
    await User.findByIdAndUpdate(req.decoded._id, {$push: {messages: newPost._id}})
    return res.json(newPost);
  },
];

exports.updatePost = [
  //should verify token/author
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

exports.deletePost = [
  //verify token
  // (req, res, next) => {
  //   jwt.verify(
  //     req.token,
  //     process.env.SECRET,
  //     { issuer: "CB" },
  //     function (err, decoded) {
  //       if (err) return res.status(400).json(err);
  //       req.decoded = decoded;
  //       next();
  //     }
  //   );
  // },

  async (req, res, next) => {
    const decoded = jwt.verify(req.token, process.env.SECRET, {issuer: 'CB'})
    //should check that user is author
    //const myMessage = await Message.findByIdAndDelete(req.params.postID).exec()
    const myMessage = await Message.findOneAndRemove({_id: req.params.postID, author: decoded._id}).exec()
    if (!myMessage) return res.status(400).json({error: 'Post not found or author/user mismatch'})

    return res.json({message: `Post (id: ${myMessage._id}) deleted`})
  }
]


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

  return res.json({post, message: 'Like sent'});
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

  return res.json({post, message: 'like removed'});
};

exports.postDetail = async (req, res, next) => {
  const myPost = await Message.findById(req.params.postID)
    .populate("author")
    .exec();

  if (!myPost) return res.json({ error: "Post not found" });

  return res.json(post);
};
