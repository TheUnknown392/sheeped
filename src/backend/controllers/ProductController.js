import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import { signUser, getExpSec, jwtVerify } from '../utils/jwt.js'
import User from '../models/UserModel.js'


const addRequest = async (req, res) => {
    const {
        items,
        notes,
        Authorization
    } = req.body;
    console.log(items, notes, Authorization);

    var userToken = jwtVerify(Authorization);

    if(!userToken){
        res.status(403).json({
            message: "Token is not valid anymore"
        });
        return;
    }

    console.log("\nuser token:",userToken);
    
    res.status(200).json({
        message: "Request Recieved"
    });

}

export { addRequest }
