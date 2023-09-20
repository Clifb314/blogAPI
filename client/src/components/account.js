import React, {useState} from "react";
import auth from "../utils/auth";
import UserService from "../utils/dataAccess";

export default function AccountPage({user}) {
    const myID = auth.getUser()._id
    const myUser = UserService.getUserHome()
    const [ userInfo, setUserInfo ] = useState(myUser)

    function handleChange(e) {
        const { value, name } = e.target

        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,            
        }))
    }

    function handleSubmit(e) {
        //set this up in dataAccess
        e.preventDefault()
        const form = new FormData({
            ...userInfo
        })
        UserService.editAccount(form)
        //success/fail via toast noti?
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input name="username" value={userInfo.username} onChange={handleChange} />
                <label htmlFor="email">E-mail: </label>
                <input name="email" value={userInfo.email} onChange={handleChange} />
                <label htmlFor="password">Password: </label>
                <input name="password" value={userInfo.password} />
                <label htmlFor="checkPW">Re-enter password:</label>
                <input name="checkPW" value={userInfo.checkPW} onChange={handleChange} />
                <button type="submit">Edit</button>
            </form>
        </div>
    )
}