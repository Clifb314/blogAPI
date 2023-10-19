import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";

export default function UsersPage({ user, noti }) {


//only run on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await UserService.getAllUsers();
      if (allUsers.err) noti("failure", allUsers.err);
      else noti("success", "Users loaded");
    }
  }, [])



  const display = allUsers.map((user) => {
    return (
      <li>
        Username: <Link to={user._id}>{user.username}</Link> - Votes:{" "}
        {user.countLikes}
      </li>
    );
  });

  return (
    <div>
      <p>All Active users:</p>
      <ul>{display ? display : "There's nothing here.."}</ul>
    </div>
  );
}
