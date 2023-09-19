import React, { useState } from 'react'
import {BrowserRouter, Routers, Route, Routes} from 'react-router-dom'
import Header from './components/header'
import Bubble from './components/bubble'
import Login from './components/login'
import Home from './components/home'
import auth from './utils/auth'


export default function Main() {

    //const [ status, setStatus ] = useState(null)
    //const [ login, setLogin ] = useState(false)
    const [ user, setUser ] = useState(null)




//routes: homepage, account, other user, all posts
//pretty sure :id doesn't work there
    return (
        <div id='content'>
            <BrowserRouter>
                <Header user={user} setUser={setUser} />
                <Routes>
                    <Route path='/home' element={<Home user={user} />} />
                    <Route path='/account' element={} />
                    <Route path='/:id' element={} />
                    <Route path='/recents' element={} />
                    <Route path='/login' element={<Login />} />
                </Routes>
                <Bubble user={user} />
            </BrowserRouter>
        </div>
    )
}