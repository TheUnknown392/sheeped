import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import { signUser, getExpSec, jwtVerify } from '../utils/jwt.js'
import Request from '../models/RequestModel.js'


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
    
    // RequestSchema
    //  user_id = 
    //  links = items links : url, name, quantity
    //  description = notes
    try{
        const newRequest = await Request.create({
            user_id : userToken.id,
            links   : items.map((item) =>({
                url      : item.url,
                name     : item.name,
                quantity : item.qty
            })),
            description  : notes
        });
        console.log("saved");
        res.status(200).json({
            message: "Request Recieved"
        });
    }catch(err){
        res.status(500).json({
            message: "Could not save to database",
            err: err.message
        });
    }


}

export { addRequest }
