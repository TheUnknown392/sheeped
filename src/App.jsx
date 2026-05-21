import { useState, createContext } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import { Session, Role } from './imports/Session'
 
export const SessionContext = createContext();

function App() {
    const [session, setSession] = useState(Session)

    const stored = localStorage.getItem("session");
    return (
        <SessionContext.Provider value = {{session, setSession}}>
            <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </SessionContext.Provider>
    )
}

export default App
