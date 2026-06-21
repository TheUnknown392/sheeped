import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import { signUser, getExpSec } from '../utils/jwt.js'
import User from '../models/UserModel.js'


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
	if(err.code == 11000){
	    res.status(409).json({
		message: "User with this email or phone already exists"
	    });
	    return;
	}
	res.status(409).json({
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
                message: "password or email does not match"
            });
            return;
        }
    }catch(err){
	    res.status(403).json({
		    message: err.message
	    });        
    }
}



export { signup, signin }
