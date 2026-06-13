import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { SessionContext } from '../App.jsx'
import NavButton from '../component/NavButton.jsx'

import sheeped from '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'

import { Session, Role } from '../imports/Session'

export default function Navigation(){
    const { session, setSession } = useContext(SessionContext);
    return(
        <nav>
            <div className="nav-logo">
                <img src={sheeped} className="nav-logo-icon"/>
                Sheeped
            </div>
            <div className="nav-links">
                <a href="#">How It Works</a> {/* TODO: add how it works page */}
                <a href="#">FAQs</a>
                <a href="#">Pricing</a> {/* TODO: add pricing page */}
            </div>
            <div className="nav-right">
                <NavButton text="Log in" to="/login" className="btn-ghost" />
                <NavButton text="Get Started" to="/register" className="btn-primary" />
            </div>
        </nav>

    )
}
