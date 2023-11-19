import React, { useEffect, useState } from "react";
import auth from "../utils/auth";

export default function Register({ noti }) {
  const template = {
    username: "",
    email: "",
    password: "",
    checkPW: "",
  };
  const errorTemplate = {
    uError: true,
    eError: true,
    cError: true,
    pError: {
      length: true,
      special: true,
      upper: true,
      lower: true,
      number: true,
      general: true,
    },
  };

  const [newUser, setNewUser] = useState(template);
  const [errorDisp, setErrorDisp] = useState(errorTemplate);

  useEffect(() => {
    const validator = () => {
      //regex
      const specRegex = /\W+/;
      const lowRegex = /[a-z]+/;
      const upRegex = /[A-Z]+/;
      const numRegex = /[0-9]+/;
      const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
      const passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      let { username, email, password, checkPW } = newUser;
      //let {uError, eError, cError, pError} = errorDisp

      //validation
      setErrorDisp({
        uError: username.length < 3 || specRegex.test(username),
        eError: !emailRegex.test(email),
        cError: password !== checkPW || checkPW.length < 1,
        pError: {
          length: password.length < 8,
          special: !specRegex.test(password),
          lower: !lowRegex.test(password),
          upper: !upRegex.test(password),
          number: !numRegex.test(password),
          general: !passRegex.test(password),
        },
      });
    };
    validator();
  }, [newUser]);

  function handleChange(e) {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await auth.register(newUser);

    if (response.err) noti("failure", response.err);
    else noti("success", response.message);
  }
  const { uError, eError, cError } = errorDisp;
  const { length, lower, upper, special, number, general } = errorDisp.pError;

  return (
    <div className="register">
      <form id="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          id="username"
          value={newUser.username}
          onChange={handleChange}
        />
        <label htmlFor="email">E-mail: </label>
        <input name="email" value={newUser.email} onChange={handleChange} />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
        />
        <label htmlFor="checkPW">Re-enter Password: </label>
        <input
          type="password"
          id="checkPW"
          name="checkPW"
          value={newUser.checkPW}
          onChange={handleChange}
        />
        <button form="registerForm" type="submit" className="submit">
          Submit
        </button>
        <div className="errorList">
          <p>Requirements: </p>
          <ul>
            <li className={uError ? "invalid" : "valid"}>
              Username must be at least 3 alphanumeric characters
            </li>
            <li className={eError ? "invalid" : "valid"}>
              Must input a valid e-mail address
            </li>
            <li className={general ? "invalid" : "valid"}>
              Password must have:
            </li>
            <ul className="passReqs">
              <li className={length ? "invalid" : "valid"}>
                At least 8 characters
              </li>
              <li className={upper ? "invalid" : "valid"}>
                At least 1 uppercase character
              </li>
              <li className={lower ? "invalid" : "valid"}>
                At least 1 lowercase character
              </li>
              <li className={special ? "invalid" : "valid"}>
                At least 1 special character
              </li>
              <li className={number ? "invalid" : "valid"}>
                At least 1 number
              </li>
            </ul>
            <li className={cError ? "invalid" : "valid"}>
              Passwords must match
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
