import React, { useState } from "react";
import auth from "../utils/auth";

export default function Register({ noti }) {
    const template = {
        username: '',
        email: '',
        password: '',
        checkPW: '',
    }

    const [newUser, setNewUser] = useState(template)

    function handleChange(e) {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })

    }

    function handleSubmit(e) {
        e.preventDefault()
        const form = new FormData(e.target)

        const response = auth.register(form)

        if (response.err) noti('failure', response.err)
        else noti('success', response.message)
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input name='username' value={newUser.username} onChange={handleChange} />
                <label htmlFor="email">E-mail: </label>
                <input name='email' value={newUser.email} onChange={handleChange} />
                <label htmlFor="password">Password: </label>
                <input type="password" name='password' value={newUser.username} onChange={handleChange} />
                <label htmlFor="checkPW">Re-enter Password: </label>
                <input type="password" name='checkPW' value={newUser.username} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )

}