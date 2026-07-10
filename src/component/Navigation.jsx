import Dropdown from 'react-bootstrap/Dropdown';

import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { SessionContext } from './SessionProvider.jsx';

import NavButton from '../component/NavButton.jsx'

import sheeped from '../assets/White-Stupid-Cute-Cartoon-Sheep.svg'

import { useLogOut } from '../imports/logOut.jsx'
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
    case Role.ADMIN:
        button = (
            <>
                <NavDropdown session = {session}/>
            </>
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
            <a href="/" style = {{textDecoration: "none", color: "white"}}>
                <div className="nav-logo">
                    <img src={sheeped} className="nav-logo-icon"/>
                    Sheeped
                </div>
            </a>
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

function NavDropdown({session}){
    const doLogOut = useLogOut();

    var orderDropdown = (
        <Dropdown.Item href="/UserOrders">Orders</Dropdown.Item>
        );
    if(session.role != Role.USER){
        orderDropdown = "";
    }
    return(
        <>
            <Dropdown>
                <Dropdown.Toggle  variant="success" className="btn-primary">
                    {session.firstName + " " + session.lastName}
                </Dropdown.Toggle>
                <Dropdown.Menu className="btn-primary">
                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                    {orderDropdown}
                    <Dropdown.Item onClick={doLogOut}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>            
        </>
    );
}
