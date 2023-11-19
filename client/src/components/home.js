import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";
import { v4 as uuidv4 } from "uuid";

export default function Home({ user, noti }) {
  //Lets display most recent post, total votes, etc for signed in user
  //for guest: explanation of what's viewable, instructions to sign up
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const myUser = await UserService.getUserHome();
        if (myUser.err) {
          noti("failure", myUser.err);
          return;
        } else {
          noti("success", "Welcome!");
          setUserInfo(myUser);
        }

        return () => {
          setUserInfo(null);
        };
      } else {
        noti("failure", "Not logged in");
        return;
      }
    };
    getUser();
  }, [user]);

  const posts =
    userInfo && userInfo.messages.length > 0 ? (
      userInfo.messages.map((post) => (
        <div key={uuidv4()}>
          <MsgCard post={post} user={userInfo._id} noti={noti} />
        </div>
      ))
    ) : (
      <p>There's nothing here... Try posting something!</p>
    );


  return user && userInfo ? (
    <div className="homepage">
      <p>Welcome back, {userInfo.username}!</p>
      <p>Here are you're most recent posts:</p>
      {posts}
    </div>
  ) : (
    <div className="homepage">
      <p>Welcome, guest!</p>
      <p>Feel free to browse the top and most recent posts</p>
      <p>Sign up for an account to make your own post!</p>
    </div>
  );
}
