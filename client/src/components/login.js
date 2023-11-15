import React, { useState } from "react";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ noti, login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validErr, setValidErr] = useState([])

  let navi = useNavigate();

  function autoLogOut() {
    setTimeout(() => {
      Auth.logout();
      login(null);
      noti("failure", "Logged out, token expiration");
    }, 900000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    const response = await Auth.login(data);
    if (response.err) noti("failure", response.err);
    else {
      console.log(response.user);
      noti("success", response.message);
      login(response.user);
      autoLogOut();
      navi("/home");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  }

  const errorsOutput = validErr.length > 0 ? validErr.map(err => {
    return <p>{err.param} : {err.msg}</p>
  }) : <p></p>

  return (
    <div className="loginDiv">
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          value={username}
          onChange={handleChange}
          autoComplete="on"
        />
        <label htmlFor="password">Password: </label>
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
        />
        <button type="submit" disabled={username && password ? false : true}>
          Log in
        </button>
      </form>
      <div className="errors">{errorsOutput}</div>
    </div>
  );
}
