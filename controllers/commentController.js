const Comment = require("../models/commentModel");
const Message = require("../models/msgModel");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.allComments = async (req, res) => {
  const allComments = await Comment.find({})
    .sort({ date: -1 })
    .populate({
      path: 'author',
      select: 'username'
    })
    .exec();

  if (allComments.length === 0) {
    return res.json({ error: "No comments found" });
  }
  return res.json(allComments);
};

exports.createComment = [
  //validate input
  // body("author")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage("Username is required")
  //   .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment cannot be empty")
    .escape(),

  async (req, res) => {
    const decoded = jwt.verify(req.token, process.env.SECRET, { issuer: "CB" });
    const errors = validationResult(req.body);
    console.log(req.body)
    //will pass parent post ID as a hidden input
    //NO get author from token, get parent from params
    //const { author, content, parent } = req.body;

    if (!errors.isEmpty()) return res.json(errors.array());

    try {
      const newComment = new Comment({
        author: decoded._id,
        content: req.body.content,
        parent: req.params.postID,
        date: new Date(),
      });
      await newComment.save();
      await Message.findByIdAndUpdate(req.params.postID, {
        $push: { comments: newComment._id },
      });
      return res.json(newComment);
    } catch(error) {
      console.log(error)
      return res.status(500).json({error: 'Failed to save comment'})
    }
  },
];

exports.editComment = [
  //validate token
  // (req, res) => {
  //   jwt.verify(
  //     req.token,
  //     process.env.SECRET,
  //     { issuer: "CB" },
  //     function (err, decoded) {
  //       if (err) {
  //         return res.status(400).json(err);
  //       } else {
  //         req.decoded = decoded;
  //         console.log(decoded)
  //         next();  
  //       }
  //     }
  //   );
  // },

  //validate input
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment cannot be empty")
    .escape(),

  async (req, res, next) => {
    const decoded = jwt.verify(req.token, process.env.SECRET, {issuer: 'CB'})
    if (!decoded._id) {
      console.log(decoded._id)
      return res.status(400).json({err: 'User mismatch'})
    }
    console.log(req.body)
    const errors = validationResult(req.body);
    //parent can also come from req.params.postID
    const { content, id } = req.body;

    if (!errors.isEmpty()) return res.json(errors.array());
    // const update = {
    //   author,
    //   content,
    //   date,
    //   parent,
    // };
    try {
      console.log('validation passed')
      const newComment = await Comment.findOneAndUpdate(
        {_id: id, author: decoded._id},
        { content: content },
        {
          new: true,
        }
      ).exec();
      return res.json(newComment);
    } catch(error) {
      return res.json({err: error})
    }

  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    const myComment = await Comment.findByIdAndRemove(req.params.commentID);
    if (!myComment) return res.status(400).json({ error: "Comment not found" });
  
    return res.json({ message: `Comment (id: ${myComment._id}) deleted` });
  } catch(error) {
    return res.json({err: error})
  }

};

exports.commentDetail = async (req, res) => {
  const myComment = Comment.findById(req.params.commentID);

  if (!myComment) return res.json({ error: "Comment not found in database" });

  else return res.json(myComment);
};
