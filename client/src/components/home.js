import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";
import MsgCard from "./msgCard";

export default function Home({ user, noti }) {
  //Lets display most recent post, total votes, etc for signed in user
  //for guest: explanation of what's viewable, instructions to sign up
  const [userInfo, setUserInfo] = useState({})
  
  useEffect(() => {
    const getUser = async () => {
      console.log('getting..')
      if (user) {
        const myUser = await UserService.getUserHome()
        if (myUser.err) {
          noti('failure', myUser.err)
          return
        } else {
          noti('success', 'User found')
          setUserInfo(myUser)
          return
        }
      } else {
        noti('failure', 'Not logged in')
        return
      }
    }
    getUser()

    return () => {
      setUserInfo(null)
    }
  }, [])

  return (
    user ? 
    <div className="homepage">
    <p>Welcome back, {userInfo.username}!</p>
    <p>Here are you're most recent posts:</p>
    <MsgCard arr={userInfo.messages} noti={noti} home={true} />
  </div>
  : 
  <div className="homepage">
  <p>Welcome, guest!</p>
  <p>Feel free to browse the top and most recent posts</p>
  <p>Sign up for an account to make your own post!</p>
  </div>

    );
}