import React, {useState} from "react";
import UserService from "../utils/dataAccess";

export default function UsersPage({user, noti}) {
 const allUsers = UserService.getAllUsers()
 if (allUsers.err) noti('failure', allUsers.err)
 else noti('success', 'Users loaded')


 const display = allUsers.map(user => {
    return (
        <li>Username: {user.username} - Votes: {user.countLikes}</li>
    )
 })
 
 return (
    <div>
        <p>All Active users:</p>
        <ul>
        {display ? display : "There's nothing here.."}
        </ul>
    </div>
 )
}