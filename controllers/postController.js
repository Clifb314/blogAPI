const Message = require("../models/msgModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.showPosts = async function (req, res, next) {
  const allMessages = await Message.find({})
    //use projection to take password out of here
    .populate({
      path: "author",
      select: "username",
    })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: 'userModel',
        select: 'username'
      },
      perDocumentLimit: 5,
    })
    .sort({ date: -1 })
    .limit(15)
    .exec();

  if (allMessages.length < 1)
    return res.json({ error: "No posts found on database" });

  return res.json(allMessages);
};

exports.topPosts = async function (req, res, next) {
  const allMessages = await Message.find({})
    .populate({
      path: "author",
      select: "username",
    })
    .populate({
      path: "comments",
      select: "author content date parent",
      populate: {
        path: "author",
        model: 'userModel',
        select: "username",
      },
      perDocumentLimit: 5,
    })
    .sort({ likes: -1 })
    .limit(15)
    .exec();

  if (allMessages.length < 1)
    return res.json({ error: "No posts found on database" });

  return res.json(allMessages);
};

exports.createPost = [
  //validate token
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

  //validate input
  body("title").trim().escape(),
  body("content")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Post cannot be blank")
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req.body);
    const { title, content } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newPost = new Message({
      title,
      content,
      date: new Date(),
      author: req.decoded._id, //will get from token or will have to find from db
      comments: [],
      likes: []
    });
    console.log(newPost)
    try {
      await newPost.save();
      await User.findByIdAndUpdate(req.decoded._id, {
        $push: { messages: newPost._id },
      });
      return res.json(newPost);  
    } catch(error) {
      console.error(error)
      return res.status(400).json({err: 'Could not upload message'})
    }
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
    try {
      const decoded = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
      const myUser = decoded._id;
  
      const newPost = await Message.findOneAndUpdate(
        { _id: req.params.postID, author: myUser },
        { title: title, content: content },
        { new: true }
      ).exec();
      if (newPost === null) return res.json({ error: "Update failed" });
  
      return res.json(newPost);
    } catch(error) {
      console.log(error)
      return res.json({error})
    }
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
    try {
      const decoded = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
      //should check that user is author
      //const myMessage = await Message.findByIdAndDelete(req.params.postID).exec()
      const myMessage = await Message.findOneAndRemove({
        _id: req.params.postID,
        author: decoded._id,
      }).exec();
      if (!myMessage)
        return res
          .status(400)
          .json({ error: "Post not found or author/user mismatch" });
      else {
        User.findByIdAndUpdate(decoded._id, {
          $pull: { messages: req.params.postID },
        });
      }
      return res.json({ message: `Post (id: ${myMessage._id}) deleted` });
    } catch(error) {
      console.error(error)
      return res.status(400).json({error})
    }
  },
];

exports.likePost = async (req, res, next) => {

  try {
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

  else return res.json({ post, message: "Like sent" });
  } catch(error) {
    console.error(error)
    return res.status(400).json({error})
  }
};

exports.dislikePost = async (req, res, next) => {
  try {
    const payload = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
    console.log(payload)
    const user = payload._id;
    const post = await Message.findOneAndUpdate(
      { _id: req.params.postID, likes: user },
      { $pull: { likes: user } },
      { new: true }
    ).exec();
  
    if (!post) {
      return res.json({ error: `Failed to dislike post` });
    } else {
      return res.json({ post, message: "like removed" });
    }
  } catch(error) {
    return res.status(400).json({error})
  }
};

exports.postDetail = async (req, res, next) => {
  const myPost = await Message.findById(req.params.postID)
    .populate({
      path: "author",
      select: "username",
    })
    .populate({
      path: "comments",
      select: "author content parent",
      populate: {
        path: "author",
        select: "username",
      },
      options: { limit: 15 },
    })
    .exec();

  if (!myPost) return res.json({ error: "Post not found" });

  return res.json(post);
};
