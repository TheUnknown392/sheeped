import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, createContext, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'

import { SessionProvider } from './component/SessionProvider.jsx'
import { Session, Role, getRoleFromToken } from './imports/Session'


import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserOrders from './pages/UserOrders.jsx'
 

function App() {
    return (
        <SessionProvider>
            <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/login"      element={<Login />} />
                <Route path="/register"   element={<Register />} />
                <Route path="/UserOrders" element={<UserOrders />} />
            </Routes>
        </SessionProvider>
    )
}

export default App
