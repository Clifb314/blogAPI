import React, { useState } from "react";


export default function Bubble({ user }) {
    //for making a new post
    const [display, setDisplay] = useState(false)

    //hide/show form onclick
    function toggleMsgForm() {
        display ? setDisplay(false) : setDisplay(true)
    }


    return (
        <div class="bubbleCont" onClick={toggleMsgForm}>
            <div className="msgBubble" display={display ? 'none' : 'block'}>
                <form id="msgForm" method="POST" action="" display={display ? 'block' : 'none'}>
                    <p>What's on your mind?</p>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" />
                    <textarea />
                    <button type="submit" hidden={user ? false : true}></button>
                    <p className="signInWarning" hidden={user ? true : false}>Must be signed in to post</p>
                </form>
            </div>
        </div>
    )
}