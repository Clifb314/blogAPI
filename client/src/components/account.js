import React, {useState} from "react";
import auth from "../utils/auth";
import UserService from "../utils/dataAccess";

export default function AccountPage({user, noti}) {
    const myID = auth.getUser()._id
    const myUser = UserService.getUserHome()
    const [ userInfo, setUserInfo ] = useState(myUser)
    const [ editting, setEditting ] = useState(false)

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
        setEditting(false)
        const form = new FormData(e.target)
        console.log(form)
        const outcome = UserService.editAccount(form)
        if (outcome.err) {
            noti('failure', outcome.err)
        } else {
            noti('success', 'Edit submitted')
        }
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
                <input name="password" value={userInfo.password ? userInfo.password : '****'} />
                <label htmlFor="checkPW">Re-enter password:</label>
                <input name="checkPW" value={userInfo.checkPW ? userInfo.checkPW : '****'} onChange={handleChange} />
                <label htmlFor="oldPW" display={editting ? 'block' : 'none'}>Old Password: </label>
                <input name="oldPW" value={userInfo.oldPW ? userInfo.oldPW : ''} display={editting ? 'block' : 'none'} onChange={handleChange} />
                <button type="submit" display={editting ? 'block' : 'none'}>Submit</button>
                <button type="button" onClick={() => setEditting(true)} display={editting ? 'none' : 'block'}>Edit?</button>
            </form>
        </div>
    )
}