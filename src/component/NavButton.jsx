import '../css/Home.css'
import { useState , useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Session, Role } from '../imports/Session.jsx';
import { SessionContext } from './SessionProvider.jsx';

function NavButton({ text, to, style={}, className="", showWhenLoggedIn=true }) {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    
    const [show, setShow] = useState(session.role == Role.USER);
    var state = !( show && !showWhenLoggedIn ) || ( !show && showWhenLoggedIn );

    if(state){
	return (
            <Link to={to} >
		<button className={className} style={style}>
                    {text}
		</button>
            </Link>
	);
    }
}

export default NavButton;
