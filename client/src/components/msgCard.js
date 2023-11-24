import React, { useEffect, useMemo, useState } from "react";
import PopComments from "./popComments";
import CommentForm from "./commentForm";
import UserService from "../utils/dataAccess";
import { v4 as uuidv4 } from "uuid";

export default function MsgCard({ post, user, noti, redraw }) {
  const [editting, setEditting] = useState(false);
  const [openMsg, setOpenMsg] = useState({title: post.title, content: post.content});
  const [showComments, setShowComments] = useState(false);

  function toggle() {
    if (editting) {
      setEditting(false);
      setOpenMsg({});
    } else {
      setEditting(true);
      setOpenMsg({ ...post });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    toggle();
    //const form = new FormData(e.target);
    const form = {
      title: openMsg.title,
      content: openMsg.content
    }
    const result = await UserService.editPost(post._id, form);
    if (result.err) console.log(result.err);
    else console.log(result);
  }

  function refreshCard(commID, content) {
    const newArr = post.comments.map((comment => {
      if (comment._id === commID) {
        const newComm = {
          ...comment,
          content: content
        }
        return newComm
      } else {
        return comment
      }
    }))



    redraw(post._id, newArr)
    setShowComments(true)
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setOpenMsg({
      ...openMsg,
      [name]: value,
    });
  }

  async function handleVote(e, up) {
    if (!user) {
      noti("failure", "Must be logged in to vote");
      return;
    }
    e.disabled = e.disabled ? false : true;
    const result = await UserService.likePost(post._id, up);
    console.log(result);
  }

  function handleDelete() {
    const result = UserService.deletePost(post._id);
    if (result.err) noti("failure", result.err);
    else {
      noti("success", "Post deleted");
    }
  }

  function toggleComments() {
      !showComments ? setShowComments(true) : setShowComments(false);
  }

  const allComments =
    post && post.comments.length > 0 ? (
      post.comments.map((comment) => {
        return (
          <div key={uuidv4()}>
            <PopComments comment={comment} user={user} redraw={refreshCard} />
          </div>
        );
      })
    ) : (
      <p>*crickets*</p>
    );

  const displayComments = (view, post) => {
    if (view && post) {
      return (
        <div>
        {allComments}
        <p className="toggleCom" onClick={toggleComments}>
          hide comments
        </p>
      </div>
      )
    } else {
      return (
        <p className="toggleCom" onClick={toggleComments}>
        Show {post.comments.length} comment(s)...
      </p>
      )
    }
  } 

  const display = useMemo(
    () => displayComments(showComments, post)
  , [showComments])



  const userID = user;
  const authorID = post.author._id ? post.author._id : post.author;
  const liked = post.likes.includes(userID)
  return (
    <div className="msgDiv">
      <div className="msgCard" hidden={editting ? true : false}>
        <p>
          <span className="username">
            <em>{post.author.username}</em>
          </span>
        </p>
        <p>
          <span className="title">{post.title}</span>
        </p>
        <p className="postP">
          <span className="postContent">{post.content}</span>
        </p>
        <div className="postDate">
          <p>{new Date(post.date).toLocaleString()}</p>
          <p>Likes : {post.likes.length}</p>
        </div>
        <div className="commentTogs">
          <CommentForm postID={post._id} postAuth={post.author._id} user={user} />
          {display}
        </div>
        <div className="postControls">
          <div className="votes">
            <button
              className="submit"
              disabled={liked}
              hidden={userID === authorID ? true : false}
              onClick={(e) => handleVote(e, true)}
            >
              Like
            </button>
            <button
              className="delete"
              disabled={!liked}
              hidden={userID === authorID ? true : false}
              onClick={(e) => handleVote(e, false)}
            >
              Dislike
            </button>
          </div>
          <div className="userbtns">
            <button
              className="edit"
              onClick={toggle}
              hidden={userID === authorID ? false : true}
            >
              Edit?
            </button>
            <button
              className="delete"
              onClick={handleDelete}
              hidden={userID === authorID ? false : true}
            >
              Delete?
            </button>
          </div>
        </div>
      </div>
      <div className="msgForm" hidden={editting ? false : true}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            name="title"
            value={openMsg.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            value={openMsg.content}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={toggle}>Close</button>
        </form>
      </div>
    </div>
  );
}
