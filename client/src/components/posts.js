import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";

export default function Posts({ user, sorting, noti }) {

  useEffect(() => {
    let posts
    const getPosts = async () => {
      if (sorting === "recent") {
        posts = await UserService.getAllPosts();
      } else posts = await UserService.getTopPosts();
    
      if (posts.err) noti("failure", posts.err);
      else noti("success", "Posts loaded");
    }
    getPosts()      
  }, [])

  const display = posts.map((post) => {
    return <MsgCard post={post} noti={noti} />;
  });

  return posts.length < 1 ? <p>There's nothing here...</p> : { display };
}
