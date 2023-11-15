import React, { useState } from "react";
import UserService from "../utils/dataAccess";

export default function Bubble({ user, noti }) {
  //for making a new post
  const [display, setDisplay] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  //hide/show form onclick
  function toggleMsgForm(e) {
    // if (display) {
    //   setDisplay(false)
    //   //e.target.className = 'bubbleCont'
    // } else {
    //   setDisplay(true)
    //   //e.target.className = "bubbleCont open";
    // }
    if (!display) setDisplay(true)
  }

  function closeForm() {
    setDisplay(false)
    setTitle('')
    setContent('')
  }

  async function handleSubmit(e) {
    e.preventDefault();
    //formdata doesn't work natively with express-validator. Would need formidable
    //const form = new FormData(e.target);
    const form = {
      title,
      content
    }
    console.log(form);
    const response = await UserService.newPost(form);
    if (response.err) noti('failure', response.err)
    else noti('success', 'Message posted!')
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "content") {
      setContent(value);
    } else setTitle(value);
  }
  const PLACEHOLDER = "Speak your mind...";

  return (
    <div className="bubbleCont" onClick={toggleMsgForm}>
      <div className="msgBubble" hidden={!display ? true : false}>
        <form
          id="msgForm"
          method="POST"
          action=""
          display={display ? "block" : "none"}
          onSubmit={handleSubmit}
        >
          <p>What's on your mind?</p>
          <label htmlFor="Bubtitle">Title:</label>
          <input id="Bubtitle" type="text" name="title" onChange={handleChange} value={title} placeholder="optional" />
          <textarea
            name="content"
            value={content}
            onChange={handleChange}
            placeholder={PLACEHOLDER}
          />
          <button type="submit" hidden={user ? false : true}>Submit</button>
          <button type="button" onClick={closeForm} >Close</button>
          <p className="signInWarning" hidden={user ? true : false}>
            Must be signed in to post
          </p>
        </form>
      </div>
    </div>
  );
}
