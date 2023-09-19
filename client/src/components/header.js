import React, { useState } from "react";

export default function Header() {
    //add in router functions later
    //add in reading the token to change sign in/log out
    return (
        <div className="header">
           <div className="logo">Logo will go here</div>
           <div className="homeLinks">
            <ul>
                <li>Home</li>
                <li>All Posts</li>
                <li>Top Posts</li>
                <li>Sign in</li>
            </ul>
            </div> 
        </div>
    )
}