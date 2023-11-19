import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import auth from "../utils/auth";

export default function CommentForm({ postID, postAuth, user }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState('')


  function handleChange(e) {
    setContent(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShow(false);
    // form = new FormData(e.target);
    const form = {
      content: content
    }
    const result = await UserService.postComment(postID, form);
    if (result.err) {
      console.log(result.err);
      return;
    } else {
      console.log("Successfully submitted");
    }
  }

  const toggleMsg = user === postAuth ? " " : "Click to respond";

  function toggle() {
    if (user === postAuth) return;
    show ? setShow(false) : setShow(true);
  }
  const PLACEHOLDER = user ? "Be civil..." : "Please log in to comment";
  let display = show ? (
    <form onSubmit={handleSubmit}>
      <label className="comLabel" htmlFor="comText">
        Comment: 
      </label>
      <textarea id="comText" name="content" value={content} placeholder={PLACEHOLDER} onChange={handleChange} />
      <div className="comControl">
        <button
          className="submit"
          type="submit"
          hidden={!user || user === postAuth ? true : false}
        >
          Submit
        </button>
        <p className="toggleResp" onClick={toggle}>
          Close
        </p>
      </div>
    </form>
  ) : (
    <p className="toggleResp" onClick={toggle}>
      {toggleMsg}
    </p>
  );

  return <div className="commentForm">{display}</div>;
}
