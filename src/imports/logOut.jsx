import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../component/SessionProvider.jsx";

export function logOut() {
    const { refreshSession } = useContext(SessionContext);
    const navigate = useNavigate();

    return () => {
        localStorage.clear();
        refreshSession();
        navigate("/");
    };
}
