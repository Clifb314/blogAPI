import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Routers,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/header";
import Bubble from "./components/bubble";
import Login from "./components/login";
import Home from "./components/home";
import auth from "./utils/auth";
import Posts from "./components/posts";
import UsersPage from "./components/users";
import AccountPage from "./components/account";
import ToastContainer from "./components/toastCont";
import Register from "./components/register";
import UserDetail from "./components/userDetail";
import ErrorPage from "./components/errorPage";
import PostDetail from "./components/msgDetail";
import { v4 as uuidv4 } from "uuid";

export default function Main() {
  const [user, setUser] = useState(null);
  const [noti, setNoti] = useState([]);

  useEffect(() => {
    checkUser()
    clearNoti()
  }, [])

  const checkUser = () => {
    const myUser = auth.getUser();
    if (!myUser) {
      setUser(null);
      return;
    }
    const parsed = JSON.parse(myUser);
    setUser(parsed.user);
  };

  function clearNoti() {
    setNoti([]);
  }

  function removeNoti(id) {
    setNoti((prev) => prev.filter((toast) => toast.id !== id));
  }

  function newNoti(type, message) {
    const myNoti = {
      id: uuidv4(),
      type,
      message,
    }
    if (noti.length > 5) {
      let slice = noti.slice(1)
      setNoti([...slice, myNoti])
    } else {
      setNoti([...noti, myNoti]);
    }
    setTimeout(() => removeNoti(myNoti.id), 50000);
  }


  //routes: homepage, account, other user, all posts
  //pretty sure :id doesn't work there
  //:id does work! useParams
  return (
    <div id="content">
        <BrowserRouter>
        <Header user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Home user={user} noti={newNoti} logout={setUser} />} />
            <Route
              path="/account"
              element={<AccountPage user={user} noti={newNoti} />}
            />
            <Route
              path="/users"
              element={<UsersPage user={user} noti={newNoti} />}
            />
            <Route path="/users/:userID" element={<UserDetail noti={newNoti} />} />
            <Route
              path="/posts"
              element={<Posts user={user} sorting="recent" noti={newNoti} />}
            />
            <Route
              path="/top"
              element={<Posts user={user} sorting="top" noti={newNoti} />}
            />
            {/* message detail page */}
            <Route path="/posts/:postID" element={<PostDetail />} />
            {/* comment detail page */}
            <Route
              path="/login"
              element={<Login noti={newNoti} login={setUser} />}
            />
            <Route path="/register" element={<Register noti={newNoti} />} />
            {/*Error page*/}
            <Route
              path="*"
              element={<ErrorPage
                errs={{ source: "Global", err: "Invalid route/url" }}
                />}
              />
                  
          </Routes>
        </BrowserRouter>
        <Bubble user={user} noti={newNoti} />
        <ToastContainer data={noti} onClick={removeNoti} removeAll={clearNoti} />
    </div>
  );
}
