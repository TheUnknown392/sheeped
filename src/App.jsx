import { useState, createContext } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

import { Session, Role } from './imports/Session'

export const SessionContext = createContext();

function App() {
  const [session, setSession] = useState(Session)
  
  // const navigate = useNavigate()

  const stored = localStorage.getItem("session");
  return (
      <SessionContext.Provider value = {{session, setSession}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </SessionContext.Provider>
  )
}

export default App
