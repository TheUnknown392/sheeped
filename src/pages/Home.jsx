import '../css/Home.css'
import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { Session, Role } from '../imports/Session'
import { SessionContext } from '../component/SessionProvider.jsx';

import Login from './Login'
import NavButton from '../component/NavButton.jsx'
import Navigation from '../component/Navigation.jsx'
import Hero from '../component/Hero.jsx'
import MainForm from '../component/Form.jsx'
import Faq from '../component/FAQ.jsx'
import Footer from '../component/Footer.jsx'
import AdminDashboard from '../component/AdminDashboard.jsx'



function Guest(){

    return (
        <>
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
            <MainForm />
            <Faq />
            <Footer />
        </>
        
    )
}

function Admin(){
    return (
        <>
            <AdminDashboard />
        </>
    )
}

function getPage(session){
    switch(session.role){
    case Role.GUEST:
        return <Guest />
        break;
    case Role.USER:
        return <User />
        break;
    case Role.ADMIN:
         return <Admin />
        break;
    case Role.INVALID:
	return (<p> invalid page </p>);
    default:
        return (<p> some error occurred in Home.jsx </p>)
    }
}

function Home() {
    const { session, setSession } = useContext(SessionContext);

    
    let page = getPage(session);
    
    return (
	    <>
            <div>
		        <Navigation />
		        {page}
            </div>
	    </>
    )
}

export default Home
