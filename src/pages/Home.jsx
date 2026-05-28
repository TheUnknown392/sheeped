import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Login from './Login'
import NavButton from '../component/NavButton.jsx'
import Navigation from '../component/Navigation.jsx'
import Hero from '../component/Hero.jsx'
import MainForm from '../component/Form.jsx'
import Faq from '../component/FAQ.jsx'
import Footer from '../component/Footer.jsx'
import AdminDashboard from '../component/AdminDashboard.jsx'

import { SessionContext } from '../App.jsx'

import { Session, Role } from '../imports/Session'


function Guest(){

    return (
        <>
            <Navigation /> {/* todo: navbar changes as page changes */}
            <Hero />
            <MainForm />
            <Faq />
            <Footer />
        </>
    )
}

function User(){
    return (
        <>
            <Navigation />
            <MainForm />
            <Faq />
            <Footer />
        </>
        
    )
}

function Admin(){
    return (
        <>
            <Navigation />
            <AdminDashboard />
        </>
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
            <User />
        </div>
    )
}

export default Home
