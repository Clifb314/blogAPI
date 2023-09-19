import React, { useState } from 'react'
import {BrowserRouter, Routers, Route, Routes} from 'react-router-dom'
import Header from './components/header'
import Bubble from './components/bubble'
import Login from './components/login'
import auth from './utils/auth'


export default function Main() {

    const [ status, setStatus ] = useState(null)
    const [ login, setLogin ] = useState(false)


//routes: homepage, account, other user, all posts
    return (
        <div id='content'>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/home' element={} />
                    <Route path='/account' element={} />
                    <Route path='/:id' element={} />
                    <Route path='/recents' element={} />

                </Routes>
            </BrowserRouter>
        </div>
    )
}