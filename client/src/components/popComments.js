import React, { useState } from "react";
import UserService from "../utils/dataAccess";
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom";

export default function PopComments({ comment, user }) {
  const [editting, setEditting] = useState(false);
  const [openComment, setOpenComment] = useState("");
  const navi = useNavigate();

  //const comments = await UserService.getComments(postID)

  function handleChange(e) {
    setOpenComment(e.target.value);
  }

  function handleClick() {
    if (editting) {
      setEditting(false);
      setOpenComment({});
    } else {
      setEditting(true);
      setOpenComment(comment.content);
    }
  }

  //finish submit/delete pls
  async function handleSubmit(e) {
    e.preventDefault();
    //const form = new FormData(e.target);
    const form = openComment
    const result = await UserService.editComment(comment._id, form);
    if (result.err) {
      navi("/error", { state: { source: "Comments", err: result.err } });
      return;
    }
    //error handling
  }

  async function handleDelete() {
    const result = await UserService.delComment(comment._id);
    if (result.err) {
      navi("/error", { state: { source: "Comments", err: result.err } });
      return;
    }
    //error handling
  }

  return (
    <div className="commOut" key={uuidv4()}>
      <div className="commCard" hidden={editting ? true : false}>
        <p className="author">{comment.author.username}</p>
        <p className="content">{comment.content}</p>
        <p className="postDate">{new Date(comment.date).toLocaleString()}</p>
        <div className="commControl">
          <button
            className="edit"
            onClick={handleClick}
            hidden={user === comment.author._id ? false : true}
          >
            Edit?
          </button>
          <button
            className="delete"
            onClick={handleDelete}
            hidden={user === comment.author._id ? false : true}
          >
            Delete?
          </button>
        </div>
      </div>
      <div hidden={editting ? false : true}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="comContent">
            Comment:{" "}
            <textarea
              id="comContent"
              name="content"
              value={openComment}
              onChange={handleChange}
            />
          </label>
          <button className="submit" type="submit" hidden={!user ? true : false}>Submit</button>
          <button className="delete" type="button" onClick={handleClick}>Close</button>
        </form>
      </div>
    </div>
  );
}
