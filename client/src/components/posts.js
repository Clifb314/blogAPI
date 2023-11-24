import React, { useEffect, useMemo, useState } from "react";
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


  //fix output. Comment is coming out undefined?
  function redrawCard(postID, commArr) {
    //get post to be updated
    const target = postList.filter(post => post._id === postID)
    //shift because filter returns an array
    const targetObj = target.shift()
    console.log(targetObj)
    //update post
    const output = {
      ...targetObj,
      comments: commArr
    }
    const newPostList = postList.map(post => {
      if (post._id === postID) return output
      else return post
    })
    console.log(newPostList)
    setPostList(newPostList)
    // setPostList([
    //   ...postList,
    //   output
    // ])
  }

  const renderMsgs = (list) => {

    if (list.length < 1) return "There's nothing here :("
    else {
      const output = postList.map(post => {
        return (
          <div key={uuidv4()}>
            <MsgCard post={post} noti={noti} user={myUser} redraw={redrawCard} />
          </div>
        )
      })
      return output
    }


    // postList.lenth > 1 
    // ? postList.map((post) => {
    //   return (
    //     <div key={uuidv4()}>
    //       <MsgCard post={post} noti={noti} user={myUser} redraw={redrawCard} />
    //     </div>
    //   );
    // })
    // : "There's nothing here :("
  }
  

  const output = useMemo(() => 
    renderMsgs(postList)
  , [postList, sorting])

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

  return ( 
  <div className="postView">{output}</div>
  )
}