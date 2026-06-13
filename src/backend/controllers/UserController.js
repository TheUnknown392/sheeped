import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'

import User from '../models/UserModel.js'

dotenv.config();

// keep this somewhere else
function signUser(info){
    return jwt.sign(newUser,JWT_CHABI);
}

const signup = async (req, res) => {
    const {firstName, lastName, email , phone, address, password} = req.body;
    const userExists = await User.findOne({
        email: email
    })

    if(userExists){
        res.status(403).json({
            message: "Email is already taken",
        });
    }else{
        const hashedPassword = bcryptjs.hashSync(password,5);
        try{
            const newUser = await User.create({
                firstName: firstName,
                lastName : lastName,
                email    : email,
                phone    : phone,
                address  : address,
                password : hashedPassword
            });
            // we don't need to send all the details.
            var token = signUser(newUser);
            res.status(201).json({
                message: "User Created",
                token  : token
            });
        }catch(err){
            res.status(400).json({
                message: "User Creation failed",
                error: err.message
            });            
        }

    }
    

}

const signin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({
        email: email
    })

    if(!user){
        res.status(404).json({
            message: "User does not exist",
        });
    }else{
        try{
            const valid = bcryptjs.compareSync(password,user.password);
            if(valid){
                var token = signUser(user);
                res.status(201).json({
                    message: "login sucessfull",
                    token = token;
                });
                console.log(user);
            }else{
                res.status(403).json({
                    message: "password does not match"
                });
                console.log("password does not match");
            }
        }catch(err){
            res.status(400).json({
                message: "failed searching for user",
                error: err.message
            });            
        }

    }
    

} 



export { signup, signin }
