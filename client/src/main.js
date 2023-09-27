import React, { useState } from 'react'
import {BrowserRouter, Routers, Route, Routes, Navigate} from 'react-router-dom'
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
import UserDetail from './components/userDetail'
import ErrorPage from './components/errorPage'
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
//:id does work! useParams
    return (
        <div id='content'>
            <BrowserRouter>
                <Header user={user} setUser={setUser} />
                <Routes>
                    <Route path='/' element={<Navigate to='/home' />} />
                    <Route path='/home' element={<Home user={user} noti={newNoti} />} />
                    <Route path='/account' element={<AccountPage user={user} noti={newNoti} />} />
                    <Route path='/users' element={<UsersPage user={user} noti={newNoti} />} />
                        <Route path='/:userID' element={<UserDetail noti={newNoti} />} />
                    <Route path='/posts' element={<Posts user={user} sorting='recent' noti={newNoti} />} />
                        <Route path='/top' element={<Posts user={user} sorting='top'/>} noti={newNoti} />
                        {/* message detail page */}
                            {/* comment detail page */}
                    <Route path='/login' element={<Login noti={newNoti} />} />
                    <Route path='/register' element={<Register noti={newNoti} />} />
                    {/*Error page*/}
                    <Route path='*' element={<ErrorPage errs={{Source: 'Global', err: 'Invalid route/url'}} />} />
                </Routes>
                <Bubble user={user} />
                <ToastContainer data={noti} onClick={removeNoti} removeAll={clearNoti} />
            </BrowserRouter>
        </div>
    )
}