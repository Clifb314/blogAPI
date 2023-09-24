import React, { useState } from "react";
import PopComments from "./popComments";
import CommentForm from "./commentForm";
import auth from "../utils/auth";
import UserService from "../utils/dataAccess";


export default function MsgCard({ arr, home }) {
    const [editting, setEditting] = useState(false)
    const [ openMsg, setOpenMsg ] = useState({})
    const myUser = auth.getUser()

    function toggle(msg) {
        if (editting) {
            setEditting(false)
            setOpenMsg({})
        } else {
            setEditting(true)
            setOpenMsg({
                title: msg.title,
                content: msg.content,
                postID: msg._id
            })
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        toggle()
        const form = new FormData(e.target)
        const result = UserService.editPost(openMsg.postID, form)
        if (result.err) console.log(result.err)
        else console.log(result)
    }

    function handleChange(e) {
        const { name, value } = e.target
        setOpenMsg({
            ...openMsg,
            [name]: value
        })
    }

    function handleVote(postID, up) {
        e.disabled = true
        const result = UserService.likePost(postID, up)
        console.log(result)
    }


    const display = arr.map(msg => {
        return (
            <div className="msgDiv">
                <div className="msgCard" display={editting ? 'none' : 'block'}>
                    <p display={home ? 'none' : 'block'}>Author: {msg.author.username}</p>
                    <p>Title: {msg.title}</p>
                    <p>Post: {msg.content}</p>
                    <p>Date: {msg.easyDate}</p>
                    <p>Likes: {msg.countLikes}</p>
                    <p>Comments: {msg.countComments}</p>
                    <div className="votes" display={myUser._id === msg.author._id ? 'none' : 'block'}>
                        <button onClick={() => handleVote(msg._id, true)}>Like</button>
                        <button onClick={() => handleVote(msg._id, false)}>Dislike</button>
                    </div>
                    <button onClick={() => toggle(msg)} display={myUser._id === msg.author._id || myUser._id === msg.author ? 'none' : 'block'}>edit?</button>
                    <CommentForm postID={msg._id} />
                    <PopComments postID={msg._id} />
                </div>
                <div className="msgForm" display={editing ? 'block' : 'none'}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="title">Title: </label>
                        <input name="title" value={msg.title} onChange={handleChange} />
                        <textarea name="content" value={msg.content} onChange={handleChange} />
                        <button type="submit">submit</button>
                        <button onClick={toggle}>Close</button>
                    </form>
                </div>
            </div>
        )
    })

    return (
        arr.length > 0 ?
            <div className="msgCont">
                {display}
            </div>
        : <p>There's nothing here..</p>
    )
}