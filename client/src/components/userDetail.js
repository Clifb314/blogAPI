import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import { useParams } from "react-router-dom";
import MsgCard from "./msgCard";

export default function UserDetail({ noti }) {
  const [ user, setUser] = useState(null)
  const userID = useParams().userID;

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserService.getUserPage(userID);
      if (user.err) {
        noti('failure', user.err)
        return
      } else {
        setUser(user)
      }
    }
    fetchUser()
  }, [])


    const display = (
      <div>
        <p>Username: {user.username}</p>
        <p>Vote Score: {user.countLikes}</p>
        <p>Recent Posts: </p>
        {/* Put message container component here */}
        <div className="msgCont">
          {user.messages.map((msg) => {
            return <MsgCard post={msg} noti={noti} />;
          })}
        </div>
      </div>
    );

  return !user ? (
    <div>
    <p>There's nothing here...</p>
    <p>User not found or problem accessing database</p>
    <p>Error: {user.err}</p>
  </div>
  ) : (
        <div>{ display }</div>
  );
}
