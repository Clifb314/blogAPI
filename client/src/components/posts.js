import React, {useState} from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";

export default async function Posts({ user, sorting, noti }) {

    let posts
    if (sorting === 'recent') {
        posts = await UserService.getAllPosts()
    } else posts = await UserService.getTopPosts()

    if (posts.err) noti('failure', posts.err)
    else noti('success', 'Posts loaded')


    return (
        <MsgCard arr={posts} />
    )
}