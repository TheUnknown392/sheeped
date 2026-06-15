import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'

import User from '../models/UserModel.js'

dotenv.config();

// keep this somewhere else
    function getExpSec(sec){
        return Math.floor(Date.now() / 1000) + (sec);
    }
    function signUser(user){
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

const signup = async (req, res) => {
    const {firstName, lastName, email , phone, address, password} = req.body;
    try{
        const userExists = await User.findOne({
            email: email
        });
        
        if(userExists){
            res.status(403).json({
                message: "Email is already taken",
            });
            return;
        }

        const hashedPassword = bcryptjs.hashSync(password,5);

        const newUser = await User.create({
            firstName: firstName,
            lastName : lastName,
            email    : email,
            phone    : phone,
            address  : address,
            password : hashedPassword
        });

        var token = signUser(newUser);
        res.status(200).json({
            message: "User Created",
            token  : token
        });
	}catch(err){
	    res.status(403).json({
		    message: err.message
	    });
	}
}

const signin = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({
            email: email
        })
        
        if(!user){
            res.status(404).json({
                message: "User does not exist",
            });
            return;
        }

        const valid = bcryptjs.compareSync(password,user.password);
        
	    if(valid){
            var tok = signUser(user);
            res.status(200).json({
                message: "login sucessfull",
                token: tok
            });
            console.log(user);
        }else{
            res.status(403).json({
                message: "password does not match"
            });
            console.log("password does not match");
            return;
        }
    }catch(err){
	    res.status(403).json({
		    message: err.message
	    });        
    }
}



export { signup, signin }
