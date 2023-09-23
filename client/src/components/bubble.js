import React, { useState } from "react";
import UserService from "../utils/dataAccess";


export default function Bubble({ user }) {
    //for making a new post
    const [display, setDisplay] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    //hide/show form onclick
    function toggleMsgForm() {
        display ? setDisplay(false) : setDisplay(true)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const form = new FormData(e.target)
        console.log(form)
        UserService.newPost(form)
    }

    function handleChange(e) {
        const { name, value } = e.target
        if (name === 'content') {
            setContent(value)
        } else setTitle(value)
    }
    const PLACEHOLDER = 'Speak your mind...'

    return (
        <div class="bubbleCont" onClick={toggleMsgForm}>
            <div className="msgBubble" display={display ? 'none' : 'block'}>
                <form id="msgForm" method="POST" action="" display={display ? 'block' : 'none'} onSubmit={handleSubmit}>
                    <p>What's on your mind?</p>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" onChange={handleChange} />
                    <textarea name="content" onChange={handleChange} placeholder={PLACEHOLDER} />
                    <button type="submit" hidden={user ? false : true}></button>
                    <p className="signInWarning" hidden={user ? true : false}>Must be signed in to post</p>
                </form>
            </div>
        </div>
    )
}