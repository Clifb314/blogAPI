import React, { useState } from "react";
import UserService from "../utils/dataAccess";
import auth from "../utils/auth";


export default async function PopComments({ postID }) {
    const [ show, setShow ] = useState(false)
    const [editting, setEditting] = useState(false)
    const [openComment, setOpenComment] = useState({})
    const myUser = auth.getUser()

    const comments = await UserService.getComments(postID)

    function toggle() {
        show ? setShow(false) : setShow(true)
    }

    function handleChange(e) {
        setOpenComment({
            ...openComment,
            content: e.target.value,
        })
    }

    function handleClick(comm) {
        if (editting) {
            setEditting(false)
            setOpenComment({})
        } else {
            setEditting(true)
            setOpenComment(comm)
        }
    }

    const display = comments.map(comm => {
        return (
            <div className="commOut">
                <div className="commCard" display={editting ? 'none' : 'block'}>
                    <p>{comm.author}</p>
                    <p>{comm.content}</p>
                    <p>{comm.easyDate}</p>
                    <button onClick={() => handleClick(comm)} display={myUser._id === comm.author._id ? 'block' : 'none'}>Edit?</button>
                </div>
                <div display={editting ? 'block' : 'none'}>
                    <form>
                        <label htmlFor="content">Comment: <textarea name="content" value={openComment.content} onChange={handleChange} /></label>
                        <button type="submit">Submit</button>
                        <button onClick={handleClick}>Close</button>
                    </form>
                </div>
            </div>
        )
    })

    const count = (
        <p onClick={toggle}>Show {comments.length + 1} comments..</p>
    )

    return (
        show ?
        <div className="commCont" onClick={toggle}>
            {display}
        </div>
        : {count}
    )
}