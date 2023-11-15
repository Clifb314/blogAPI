import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";
import { v4 as uuidv4 } from "uuid";
import auth from "../utils/auth";

export default function Posts({ user, sorting, noti }) {
  const [postList, setPostList] = useState([]);
  const [myUser, setMyUser] = useState(null);
  useEffect(() => {
    const getPosts = async () => {
      let posts;
      if (sorting === "recent") {
        posts = await UserService.getAllPosts();
      } else posts = await UserService.getTopPosts();
      if (posts.err) {
        noti("failure", posts.err);
        return;
      } else {
        setPostList(posts);
        noti("success", "Posts loaded");
      }
    };
    getPosts();
  }, [sorting]);

  useEffect(() => {
    const getUser = async () => {
      const fetchUser = auth.getUser();
      if (!fetchUser) return;
      else {
        const output = await JSON.parse(fetchUser);
        setMyUser(output.user._id);
      }
    };
    getUser();

    return () => {
      setMyUser(null);
    };
  }, [user, sorting]);

  const display =
    postList.length > 0
      ? postList.map((post) => {
          return (
            <div key={uuidv4()}>
              <MsgCard post={post} noti={noti} user={myUser} />
            </div>
          );
        })
      : "Database is empty :(";

  return <div className="postView">{display}</div>;
}
