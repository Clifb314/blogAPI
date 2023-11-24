import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Routers,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./header";
import Bubble from "./bubble";
import Login from "./login";
import Home from "./home";
import auth from "../utils/auth";
import Posts from "./posts";
import UsersPage from "./users";
import AccountPage from "./account";
import Register from "./register";
import UserDetail from "./userDetail";
import ErrorPage from "./errorPage";
import PostDetail from "./msgDetail";
import { v4 as uuidv4 } from "uuid";

export default function RouterCom({ newNoti, user, set }) {
    return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home user={user} noti={newNoti} logout={set} />} />
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
            element={<Login noti={newNoti} login={set} />}
          />
          <Route path="/register" element={<Register noti={newNoti} />} />
          {/*Error page*/}
          <Route
            path="*"
            element={
              <ErrorPage
                errs={{ source: "Global", err: "Invalid route/url" }}
              />
            }
          />
        </Routes>

      </BrowserRouter>
    )
}