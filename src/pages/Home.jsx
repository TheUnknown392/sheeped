import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Login from './Login'
import { SessionContext } from '../App.jsx'

import { Session, Role } from '../imports/Session'


function Guest(){
    return (
        <p> You are a guest </p>
    )
}

function User(){
    return (
        <p> You are a user </p>
    )
}

function Admin(){
    return (
        <p> You are a admin </p>
    )
}


function Home() {
    const { session, setSession } = useContext(SessionContext);
    console.log(session)

    let page

    switch(session.role){
    case Role.GUEST:
        page = <Guest />
        break;
    case Role.USER:
        page = <User />
        break;
    case Role.ADMIN:
         page = <Admin />
         break;
    default:
        (<p> some error occurred in Home.jsx </p>)
    }

    

    return (
        <div>
            {page}
        </div>
    )
}

export default Home
