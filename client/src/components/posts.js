import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";
import { v4 as uuidv4 } from "uuid";
import auth from "../utils/auth";

export default function Posts({ user, sorting, noti }) {
  const [postList, setPostList] = useState([]);
  const [myUser, setMyUser] = useState(null)
  useEffect(() => {
    const getPosts = async () => {
      let posts;
      if (sorting === "recent") {
        posts = await UserService.getAllPosts();
      } else posts = await UserService.getTopPosts();
      console.log(posts)
      if (posts.err) {
        noti("failure", posts.err);
        return;
      } else {
        console.log(posts);
        setPostList(posts);
        noti("success", "Posts loaded");
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const fetchUser = await auth.getUser();
      console.log(fetchUser)
      if (!fetchUser) return
      else setMyUser(fetchUser._id)
    }
    getUser()
  })

  const display =
    postList.length > 1
      ? postList.map((post) => {
          return <MsgCard key={uuidv4()} post={post} noti={noti} user={myUser} />;
        })
      : "";

  return (
    <div className="postView">{display}</div>
  )
}
