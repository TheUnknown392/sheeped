import { createContext, useState, useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { Session, Role, getRoleFromToken } from '../imports/Session.jsx'
import { getToken } from '../imports/jwt.js'

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

    // Stable across renders (empty deps) so components can safely depend on
    // it in a useEffect without risking a re-render loop.
    const refreshSession = useCallback(() => {
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
    }, []);

    // save
    const value = useMemo(
        () => ({ session, setSession, refreshSession }),
        [session, refreshSession]
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}
