import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import auth from "../utils/auth";

export default function CommentForm({ postID }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const user = auth.getUser();
  }, [])


  function handleSubmit(e) {
    e.preventDefault();
    setShow(false);
    const form = new FormData(e.target);
    const result = UserService.postComment(postID, form);
  }

  function toggle() {
    show ? setShow(false) : setShow(true);
  }

  let display = show ? (
    <form onSubmit={handleSubmit}>
      <label htmlFor="content">Comment: </label>
      <textarea name="content" />
      <input name="author" hidden="true" value={user.id} />
      <input name="parent" hidden="true" value={postID} />
      <p onClick={toggle}>Close</p>
    </form>
  ) : (
    <p onClick={toggle}>Click to respond</p>
  );

  return { display };
}
