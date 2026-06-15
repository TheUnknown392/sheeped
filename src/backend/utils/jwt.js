import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import User from '../models/UserModel.js'

dotenv.config();

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
