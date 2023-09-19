import React, {useState} from "react";
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { isEmail } from 'validator'
import Auth from "../utils/auth";


export default function Login(props) {
    const [ username, setUsername ] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        Auth.login(username, password)
    }


    return (
        <div className="loginDiv">
            <form id="loginForm" onSubmit={handleSubmit}>
                <input></input>
            </form>

        </div>
    )
}