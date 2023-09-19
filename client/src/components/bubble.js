import React, { useState } from "react";


export default function Bubble() {
    const [display, setDisplay] = useState(false)

    //hide/show form onclick
    function toggleMsgForm() {
        display ? setDisplay(false) : setDisplay(true)
    }


    return (
        <div className="msgBubble" onClick={toggleMsgForm} display={display ? 'none' : 'block'}>
            <form id="msgForm" method="POST" action="" display={display ? 'block' : 'none'}>
                <p>What's on your mind?</p>
                <label htmlFor="title">Title:</label>
                <input type="text" name="title" />
                <textarea />
                <button type="submit"></button>
            </form>
        </div>
    )
}