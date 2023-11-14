import React, { useState } from "react";
import Auth from "../utils/auth";

export default function Login({ noti, login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      username,
      password,
    }
    const response = await Auth.login(data);
    if (response.err) noti("failure", response.err);
    else {
      noti("success", response.message);
      login()
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

  return (
    <div className="loginDiv">
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input name="username" value={username} onChange={handleChange} autoComplete="on" />
        <label htmlFor="password">Password: </label>
        <input name="password" value={password} onChange={handleChange} type="password" />
        <button
          type="submit"
          disabled={username && password ? false : true}
        >
          Log in
        </button>
      </form>
    </div>
  );
}
