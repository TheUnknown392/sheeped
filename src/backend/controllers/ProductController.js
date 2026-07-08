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
    
    try{
        const newRequest = await Request.create({
            user_id : userToken.id,
            links   : items.map((item) => ({
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

const recentRequest = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.params.page) || 1);
        const limit = 20;
        const skip = (page - 1) * limit;

        const recentRequests = await Request.find()
            .populate("user_id", "firstName lastName country")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const requests = [];

        recentRequests.forEach(request => {
            // Skip requests whose user no longer exists
            if (!request.user_id) {
                return;
            }

            request.links.forEach(link => {
                requests.push({
                    id: request._id,
                    customer: `${request.user_id.firstName} ${request.user_id.lastName}`,
                    country: request.user_id.country,
                    url: link.url,
                    name: link.name,
                    quantity: link.quantity,
                    description: request.description,
                    createdAt: request.createdAt
                });
            });
        });

        res.status(200).json(requests);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export { addRequest, recentRequest}
