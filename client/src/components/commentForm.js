import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import auth from "../utils/auth";

export default function CommentForm({ postID, user }) {
  const [show, setShow] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setShow(false);
    const form = new FormData(e.target);
    const result = await UserService.postComment(postID, form);
    if (result.err) {
      console.log(result.err)
      return
   } else {
    console.log('Successfully submitted')
    }
  }

  function toggle() {
    show ? setShow(false) : setShow(true);
  }
  const PLACEHOLDER = user ? 'Be civil...' : 'Please log in to comment'
  let display = show ? (
    <form onSubmit={handleSubmit}>
      <label className="comLabel" htmlFor="comText">Comment: </label>
      <textarea id="comText" name="content" placeholder={PLACEHOLDER} />
      <input name="author" hidden="true" value={user} />
      <input name="parent" hidden="true" value={postID} />
      <div className="comControl">
        <button type="submit" hidden={!user ? true : false}>Submit</button>
        <p className="toggleResp" onClick={toggle}>Close</p>
      </div>
    </form>
  ) : (
    <p className="toggleResp" onClick={toggle}>Click to respond</p>
  );

  return (
    <div className="commentForm">
      {display}
    </div>
  )
}
