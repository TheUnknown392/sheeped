import { jwtDecode } from 'jwt-decode'

export function getRoleFromToken(token){
    var decoded = jwtDecode(token);
    if(!decoded) return Role.GUEST;
    switch (decoded.rl){
        case "user":
    	    return Role.USER;
        case "admin":
            return Role.ADMIN;
        default:
            return Role.INVALID;
    }
}

export const Role = {
  GUEST:   0,
  USER:    1,
  ADMIN:   2,
  INVALID: 3
}

export const Session = {
    user_id   : null,
    email     : "",
    firstName : "",
    lastName  : "",
    role      : Role.GUEST
}
