import React, {useState} from "react";
import UserService from "../utils/dataAccess";

export default function UsersPage({user}) {
 const allUsers = UserService.getAllUsers()
 const display = allUsers.map(user => {
    return (
        <li>Username: {user.username} - Votes: {user.countLikes}</li>
    )
 })
 
 return (
    <div>
        <p>All Active users:</p>
        <ul>
        {display}
        </ul>
    </div>
 )
}