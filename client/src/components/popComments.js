import React, { useEffect, useRef, useState } from "react";
import UserService from "../utils/dataAccess";
import {v4 as uuidv4} from 'uuid'
import { useNavigate } from "react-router-dom";

export default function PopComments({ comment, user, show, redraw }) {
  const [editting, setEditting] = useState(false);
  //const [content, setContent] = useState("");
  const navi = useNavigate();
  const contentRef = useRef(comment.content)
  //const comments = await UserService.getComments(postID)

  function handleChange(e) {
    //setContent(e.target.value);
    contentRef.current = e.target.value
  }

  function handleClick() {
    if (editting) {
      setEditting(false);
      //setContent('');
    } else {
      setEditting(true);
    }
  }



  //finish submit/delete pls
  async function handleSubmit(e) {
    e.preventDefault();
    //const form = new FormData(e.target);
    const result = await UserService.editComment(comment._id, {id: comment._id, content: contentRef.current});
    if (result.err) {
      navi("/error", { state: { source: "Comments", err: result.err } });
      console.log(result.err)
      return;
    } else {
      setEditting(false)
      redraw(comment._id, contentRef.current)
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
      <div className="commCard" hidden={editting ? false : true}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="comContent">
            Comment:{" "}
          </label>
          <textarea
              id="comContent"
              name="content"
              onChange={handleChange}
              defaultValue={contentRef.current}
            />
          <button className="submit" type="submit" hidden={!user ? true : false}>Submit</button>
          <button className="delete" type="button" onClick={handleClick}>Close</button>
        </form>
      </div>
    </div>
  );
}
