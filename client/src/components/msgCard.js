import React, { useState } from "react";
import PopComments from "./popComments";
import CommentForm from "./commentForm";
import auth from "../utils/auth";
import UserService from "../utils/dataAccess";
import { uuid } from "uuidv4";

export default function MsgCard({ post, noti }) {
  const [editting, setEditting] = useState(false);
  const [openMsg, setOpenMsg] = useState({});
  const [showComments, setShowComments] = useState(false);
  const myUser = auth.getUser();

  function toggle() {
    if (editting) {
      setEditting(false);
      setOpenMsg({});
    } else {
      setEditting(true);
      setOpenMsg({ ...post });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    toggle();
    const form = new FormData(e.target);
    const result = UserService.editPost(post._id, form);
    if (result.err) console.log(result.err);
    else console.log(result);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setOpenMsg({
      ...openMsg,
      [name]: value,
    });
  }

  function handleVote(up) {
    e.disabled = true;
    const result = UserService.likePost(post._id, up);
    console.log(result);
  }

  function handleDelete() {
    const result = UserService.deletePost(post._id);
    if (result.err) noti("failure", result.err);
    else {
      noti("success", "Post deleted");
    }
  }
  const comments = post.comments.map((comment) => {
    return <PopComments comment={comment} />;
  });

  const displayComments = showComments ? (
    comments
  ) : (
    <p className="commLink">Show {post.comments.length + 1} comments...</p>
  );
  const authorID = post.author._id ? post.author._id : post.author;
  const key = uuid();
  return (
    <div className="msgDiv" key={key}>
      <div className="msgCard" display={editting ? "none" : "block"}>
        <p>Author: {post.author.username}</p>
        <p>Title: {post.title}</p>
        <p>Post: {post.content}</p>
        <p>Date: {post.easyDate}</p>
        <p>Likes: {post.countLikes}</p>
        <p>Comments: {post.countComments}</p>
        <div
          className="votes"
          display={myUser._id === authorID ? "none" : "block"}
        >
          <button onClick={() => handleVote(true)}>Like</button>
          <button onClick={() => handleVote(false)}>Dislike</button>
        </div>
        <button
          onClick={toggle}
          display={myUser._id === authorID ? "none" : "block"}
        >
          edit?
        </button>
        <button
          onClick={handleDelete}
          display={myUser._id === authorID ? "block" : "none"}
        >
          Delete?
        </button>
        <CommentForm postID={post._id} />
        {displayComments}
      </div>
      <div className="msgForm" display={editing ? "block" : "none"}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title: </label>
          <input name="title" value={msg.title} onChange={handleChange} />
          <textarea
            name="content"
            value={msg.content}
            onChange={handleChange}
          />
          <button type="submit">submit</button>
          <button onClick={toggle}>Close</button>
        </form>
      </div>
    </div>
  );
}
