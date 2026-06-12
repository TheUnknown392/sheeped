import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'

import User from '../models/UserModel.js'

dotenv.config();

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
            res.status(201).json({
                message: "User Created",
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
                res.status(201).json({
                    message: "login sucessfull"
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
