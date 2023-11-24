import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Routers,
  Route,
  Routes,
  Navigate,
  createBrowserRouter,
  routerProvider,
  RouterProvider
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

export default function Mainforked() {
  //const [ status, setStatus ] = useState(null)
  //const [ login, setLogin ] = useState(false)
  const [user, setUser] = useState(null);
  const [noti, setNoti] = useState([]);
  //const noti = useRef(new Array())

  useEffect(() => {
    setUser(checkUser())
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
    //noti.current = []
  }

  function removeNoti(id) {
    setNoti((prev) => prev.filter((toast) => toast.id !== id));
    //noti.current = noti.current.filter(toast => toast.id !== id)
  }

  const notify = useCallback((type, message) => {
    newNoti(type, message)
  }, [])


  function newNoti(type, message) {
    const myNoti = {
      id: uuidv4(),
      type,
      message,
    };
    setNoti([...noti, myNoti]);
    //noti.current = [...noti.current, myNoti]
    setTimeout(() => removeNoti(myNoti.id), 50000);
  }


  //routes: homepage, account, other user, all posts
  //pretty sure :id doesn't work there
  //:id does work! useParams

  const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to='/home' />,
        errorElement: <ErrorPage errs={{ source: "Global", err: "Invalid route/url" }} />
    },
    {
        path: '/home',
        element: <Home user={user} noti={newNoti} logout={setUser} />      
    },
    {
        path: '/account',
        element: <AccountPage user={user} noti={newNoti} />
    },
    {
        path: '/users',
        element: <UsersPage user={user} noti={newNoti} />,
        children: [
            {
                path: '/:userID',
                element: <UserDetail noti={newNoti} />
            }
        ]
    },
    {
        path: '/posts',
        element: <Posts user={user} sorting="recent" noti={notify} />,
        children: [
            {
                path: '/top',
                element: <Posts user={user} sorting="top" noti={newNoti} />
            },
            {
                path: '/:postID',
                element: <PostDetail />
            }
        ]
    },
    {
        path: '/login',
        element: <Login noti={newNoti} login={setUser} />
    },
    {
        path: '/register',
        element: <Register noti={newNoti} />
    }
  ])


  return (
    <div id="content">
      <RouterProvider router={router} />
      <Bubble user={user} noti={newNoti} />
      <ToastContainer data={noti} onClick={removeNoti} removeAll={clearNoti} />
    </div>
  );
}
