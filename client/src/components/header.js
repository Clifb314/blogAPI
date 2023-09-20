import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ user, setUser }) {
    //add in router functions later
    //add in reading the token to change sign in/log out
    //pass user/setUser as props from main.js
    function logout(e) {
        //should change this to using Auth.js
        localStorage.removeItem('user')
        setUser(null)
    }


    let checkUser
    if (user) {
        checkUser = (
            <Link to='/' onClick={logout}>Log Out</Link>
            ) 
    } else {
        checkUser = (
            <ul>
                <li><Link to='/login'></Link></li>
                <li><Link to='/signup'></Link></li>
            </ul>
        )
    }

    return (
        <div className="header">
           <div className="logo">Logo will go here</div>
           <div className="homeLinks">
                <ul>
                    <li><Link to='/home'>Home</Link></li>
                    <li><Link to='/recents'>Recent Posts</Link></li>
                    <li><Link to='/top'>Top Posts</Link></li>
                    <li>{checkUser}</li>
                </ul>
            </div> 
        </div>
    )
}