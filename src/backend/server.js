import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import UserAPI from './routes/UserRoute.js'
import ProductAPI from './routes/ProductRoute.js'
import AdminAPI from './routes/AdminRoutes.js'

dotenv.config();

import './utils/database.js'

const app = express();

app.use(express.json());
app.use(cors());

// major routes
app.use("/user",UserAPI);
app.use("/product",ProductAPI);
app.use("/get",AdminAPI); // belongs to admin only. Todo: change name to /admin from /get


app.listen(process.env.EXPRESS_PORT, () =>{
    console.log("listening sucessfully",process.env.EXPRESS_PORT);
});


