import React, {useState} from "react";
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { isEmail } from 'validator'
import Auth from "../utils/auth";


export default function Login({ noti }) {
    const [ username, setUsername ] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const response = Auth.login(username, password)
        if (response.err) noti('failure', response.err)
        else noti('success', response.message)
    }

    function handleChange(e) {
        const {name, value} = e.target.value
        if (name === 'username') {
            setUsername(value)
        } else {
            setPassword(value)
        }

    }


    return (
        <div className="loginDiv">
            <form id="loginForm" onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input name="username" value={username} onChange={handleChange} />
                <label htmlFor="password">Password: </label>
                <input name="password" value={password} onChange={handleChange} />
                <button type='submit' disabled={username && password ? false : true}>Log in</button>
            </form>

        </div>
    )
}