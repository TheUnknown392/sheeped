import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { Session, Role, getRoleFromToken } from '../imports/Session.jsx'
import { hasExpired, getToken } from '../imports/jwt.js'

export const SessionContext = createContext();

export function SessionProvider({ children }) {
    const [session, setSession] = useState(() => {
        var token = "";
        if(!(token = getToken())){
            return {
                ...Session
            };
        }
        const decodedTok = jwtDecode(token);

        return {
	        ...Session,
            user_id: decodedTok.id,
            email: decodedTok.em,
            firstName: decodedTok.fn,
            lastName: decodedTok.ln,
            role: getRoleFromToken(token)
        };
    });

    const refreshSession = () => {
        const token = getToken();
        
        if (!token) {
            setSession({ ...Session });
            return;
        }


        const decoded = jwtDecode(token);

        setSession({
            ...Session,
            user_id: decoded.id,
            email: decoded.em,
            firstName: decoded.fn,
            lastName: decoded.ln,
            role: getRoleFromToken(token)
        });
    };
    
    


    return (
        <SessionContext.Provider value={{ session, setSession, refreshSession }}>
            {children}
        </SessionContext.Provider>
    );
}
