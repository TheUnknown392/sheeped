import { useState, createContext, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import { SessionProvider } from './component/SessionProvider.jsx'
import { Session, Role, getRoleFromToken } from './imports/Session'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

 

function App() {
    return (
        <SessionProvider>
            <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </SessionProvider>
    )
}

export default App
