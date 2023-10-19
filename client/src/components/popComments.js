import React, { useState } from "react";
import UserService from "../utils/dataAccess";
import auth from "../utils/auth";
import { uuid } from "uuidv4";
import { useNavigate } from "react-router-dom";

export default async function PopComments({ comment }) {
  const [editting, setEditting] = useState(false);
  const [openComment, setOpenComment] = useState("");
  const myUser = auth.getUser();
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
    const form = new FormData(e.target);
    const result = await UserService.editComment(comment._id, form);
    if (result.err) {
      navi("/error", { state: { source: "Comments", err: result.err } });
    }
    //error handling
  }

  async function handleDelete() {
    const result = await UserService.delComment(comment._id);
    if (result.err) {
      navi("/error", { state: { source: "Comments", err: result.err } });
    }
    //error handling
  }

  return (
    <div className="commOut" key={uuid()}>
      <div className="commCard" display={editting ? "none" : "block"}>
        <p>{comment.author}</p>
        <p>{comment.content}</p>
        <p>{comment.easyDate}</p>
        <button
          onClick={handleClick}
          display={myUser._id === comment.author._id ? "block" : "none"}
        >
          Edit?
        </button>
        <button
          onClick={handleDelete}
          display={myUser_.id === comment.author._id ? "block" : "none"}
        >
          Delete?
        </button>
      </div>
      <div display={editting ? "block" : "none"}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="content">
            Comment:{" "}
            <textarea
              name="content"
              value={openComment.content}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
          <button onClick={handleClick}>Close</button>
        </form>
      </div>
    </div>
  );
}
