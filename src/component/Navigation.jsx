import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { SessionContext } from './SessionProvider.jsx';

import NavButton from '../component/NavButton.jsx'

import sheeped from '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'

import { logOut } from '../imports/logOut.jsx'
import { Session, Role } from '../imports/Session'

function updateRightButton(session){
    var button;
	switch(session.role){
	case Role.GUEST:
	case Role.INVALID:
        button = (
            <>
		        <NavButton text="Log in" to="/login" className="btn-ghost" />
		        <NavButton text="Get Started" to="/register" className="btn-primary" />
            </>
        )
		break;
	case Role.USER:
		button =(
            <button
                className="btn-ghost"
                onClick= {logOut()}
			>
                Log Out
			</button>
		)
        break;
    case Role.ADMIN:
        button = (
            <p>todo</p>
        )
        break;
    default:
        button = (
            <p> something went very Wrong </p>
        )
	}
    
	return button;
}

export default function Navigation(){
    const { session } = useContext(SessionContext);
    var rightButton = updateRightButton(session);
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
                {rightButton}
            </div>
        </nav>

    )
}
