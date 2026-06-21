import jwt from 'jsonwebtoken'

import User from '../models/UserModel.js'

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
