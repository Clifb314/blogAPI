import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import { useNavigate, useParams } from "react-router-dom";
import PopComments from "./popComments";

export default function PostDetail() {
  const [post, setPost] = useState(null)
  const navi = useNavigate();
  const postID = useParams().postID;

  useEffect(() => {
    const posts = async () => {
      const open = await UserService.getPostDetail(postID);
      if (post.err)
      return navi("/error", { state: { source: "Posts", err: post.err } });  
      setPost(open)
    }
    posts()

    return () => {
      setPost(null)
    }
  //maybe add an error page to return
  }, [])



  const comments = post.comments.map((comment) => {
    return <PopComments comment={comment} />;
  });
  return (
    <div className="msgDetail">
      <p>Author: {post.author}</p>
      <p display={post.title ? "block" : "none"}>Title: {post.title}</p>
      <p>{post.content}</p>
      <p>Date: {post.easyDate}</p>
      <p>Comments: </p>
      {comments}
    </div>
  );
}
