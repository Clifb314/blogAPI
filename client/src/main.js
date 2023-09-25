import React, { useState } from 'react'
import {BrowserRouter, Routers, Route, Routes} from 'react-router-dom'
import Header from './components/header'
import Bubble from './components/bubble'
import Login from './components/login'
import Home from './components/home'
import auth from './utils/auth'
import Posts from './components/posts'
import UsersPage from './components/users'
import AccountPage from './components/account'
import ToastContainer from './components/toastCont'
import Register from './components/register'
import {uuid} from 'uuidv4'


export default function Main() {

    //const [ status, setStatus ] = useState(null)
    //const [ login, setLogin ] = useState(false)
    const [ user, setUser ] = useState(null)
    const [noti, setNoti] = useState([])

    function clearNoti() {
        setNoti([])
    }

    function removeNoti(id) {
        setNoti((prev) => prev.filter((toast) => toast.id !== id))
    }

    function newNoti(type, message) {
        const myNoti = {
            id: uuid(),
            type,
            message
        }
        setNoti([...noti, myNoti])
        setTimeout(() => removeNoti(myNoti.id), 5000)
    }

//routes: homepage, account, other user, all posts
//pretty sure :id doesn't work there
    return (
        <div id='content'>
            <BrowserRouter>
                <Header user={user} setUser={setUser} />
                <Routes>
                    <Route path='/home' element={<Home user={user} noti={newNoti} />} />
                    <Route path='/account' element={<AccountPage user={user} noti={newNoti} />} />
                    <Route path='/users' element={<UsersPage user={user} noti={newNoti} />} />
                    <Route path='/recents' element={<Posts user={user} sorting='recent' noti={newNoti} />} />
                    <Route path='/top' element={<Posts user={user} sorting='top'/>} noti={newNoti} />
                    <Route path='/login' element={<Login noti={newNoti} />} />
                    <Route path='/register' element={<Register noti={newNoti} />} />
                </Routes>
                <Bubble user={user} />
                <ToastContainer data={noti} onClick={removeNoti} removeAll={clearNoti} />
            </BrowserRouter>
        </div>
    )
}