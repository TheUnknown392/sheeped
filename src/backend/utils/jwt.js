import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'

// extra code from imports/session. remove this somehow and make it sharable with front and back end
export const Role = {
  GUEST:   0,
  USER:    1,
  ADMIN:   2,
  INVALID: 3
}


export function getExpSec(sec){
    return Math.floor(Date.now() / 1000) + (sec);
}

export function signUser(user){
    var toTok = {
        id: user._id,
        em: user.email,
        fn: user.firstName,
        ln: user.lastName,
        rl: user.role,
        exp: getExpSec(60*60*24)
    }
    
    return jwt.sign(toTok,process.env.JWT_CHABI);
}

export function jwtVerify(userToken){
    const token = userToken.replace("Bearer ", "");
    try{
        return jwt.verify(token,process.env.JWT_CHABI);
    }catch(err){
        return null;
    }
}
