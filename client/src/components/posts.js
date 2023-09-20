import React, {useState} from "react";
import UserService from "../utils/dataAccess";

export default async function Posts({ user, sorting }) {

    let posts
    if (sorting === 'recent') {
        posts = await UserService.getAllPosts()
    } else posts = await UserService.getTopPosts()

    const display = posts.map(msg => {
        return (
            <div className="msgCard">
                <p>Author: {user ? msg.author : 'anon'}</p>
                <p>Title: {msg.title}</p>
                <p>Post: {msg.content}</p>
                <p>Date: {msg.easyDate}</p>
                <p>Likes: {msg.countLikes}</p>
                <p>Comments: {msg.countComments}</p>
            </div>
        )
    })


    return (
        {display}
    )
}