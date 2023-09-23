import React, {useState} from "react";
import UserService from "../utils/dataAccess";


export default function Home({ user }) {
    //Lets display most recent post, total votes, etc for signed in user
    //for guest: explanation of what's viewable, instructions to sign up

    async function userHome() {
        const myUser = await UserService.getUserHome()
        //should makes comments a link to more info
        const messages = myUser.messages.map(msg => {
            <div className="msgCard">
                <p>{msg.content}</p>
                <p>Date: {msg.easyDate}</p>
                <p>Likes: {msg.countLikes}</p>
                <p>Comments: {msg.countComments}</p>
            </div>
        })
        return (
            <div>
                <p>Welcome back, {myUser.username}!</p>
                <p>Here are you're most recent posts:</p>
                <div class="msgCont">{messages}</div>
            </div>
        )
    }

    function guestHome() {
        return (
            <div>
                <p>Welcome, guest!</p>
                <p>Feel free to browse the top and most recent posts</p>
                <p>Sign up for an account to make your own post!</p>
            </div>
        )
    }

    return (
        user ? <userHome /> : <guestHome />
    )
}