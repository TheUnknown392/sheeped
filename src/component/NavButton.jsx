import '../css/Home.css'
import { useNavigate, Link } from "react-router-dom";

function NavButton({ text, to, style={}, className="" }) {
    const navigate = useNavigate();

    return (
        <Link to={to} >
            <button className={className} style={style}>
                {text}
            </button>
        </Link>
    );
}

export default NavButton;
