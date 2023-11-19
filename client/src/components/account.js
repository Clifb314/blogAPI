import React, { useEffect, useState } from "react";
import UserService from "../utils/dataAccess";

export default function AccountPage({ user, noti }) {

  const [userInfo, setUserInfo] = useState(null);
  const [editting, setEditting] = useState(false);


  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const myUser = await UserService.getUserHome();
        if (myUser.err) {
          noti("failure", myUser.err);
          return;
        } else {
          noti("success", "User found");
          setUserInfo(myUser);
          console.log(myUser);
        }

        return () => {
          setUserInfo(null);
        };
      } else {
        noti("failure", "Not logged in");
        return;
      }
    };
    getUser();
  }, [user])


  function handleChange(e) {
    const { value, name } = e.target;

    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    //set this up in dataAccess
    e.preventDefault();
    setEditting(false);
    //const form = new FormData(e.target);
    const outcome = UserService.editAccount(userInfo);
    if (outcome.err) {
      noti("failure", outcome.err);
    } else {
      noti("success", "Edit submitted");
    }
    //success/fail via toast noti?
  }
  const display = userInfo === null || user === null ? <p>Must be logged in to access this page</p> 
  :
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input
        name="username"
        value={userInfo.username}
        id="username"
        onChange={handleChange}
        disabled={!editting}
      />
      <label htmlFor="email">E-mail: </label>
      <input
        id="email"
        name="email"
        value={userInfo.email}
        onChange={handleChange}
        disabled={!editting}
      />
      <label htmlFor="password">{editting ? 'New password' : 'Password: '}</label>
      <input
        id="password"
        name="password"
        value={userInfo.password ? userInfo.password : "****"}
        disabled={!editting}
      />
      <label htmlFor="checkPW">{editting ? 'Re-enter new password: ' : ''}</label>
      <input
        name="checkPW"
        id="checkPW"
        value={userInfo.checkPW ? userInfo.checkPW : "****"}
        onChange={handleChange}
        hidden={!editting}
      />
      <label htmlFor="oldPW" hidden={!editting}>
        {!editting ? '' : 'Old Password: '}
      </label>
      <input
        name="oldPW"
        value={userInfo.oldPW ? userInfo.oldPW : ""}
        hidden={!editting}
        onChange={handleChange}
      />
      <button className="submit" type="submit" hidden={!editting}>
        Submit
      </button>
      <button className="delete" type="button" hidden={!editting} onClick={() => setEditting(false)}>Cancel</button>
      <button
        className="edit"
        type="button"
        onClick={() => setEditting(true)}
        hidden={editting}
      >
        Edit?
      </button>
    </form>


  return (
    <div className="userEdit">{display}</div>
  );
}
