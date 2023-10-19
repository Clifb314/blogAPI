import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";

export default function Posts({ user, sorting, noti }) {
  let posts;

  useEffect(() => {
    if (sorting === "recent") {
      posts = UserService.getAllPosts();
    } else posts = UserService.getTopPosts();
  
    if (posts.err) noti("failure", posts.err);
    else noti("success", "Posts loaded");
      
  }, [])

  const display = posts.map((post) => {
    return <MsgCard post={post} noti={noti} />;
  });

  return posts.length < 1 ? <p>There's nothing here...</p> : { display };
}
