import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import CHARGE from './utils/charge.js'

import UserAPI from './routes/UserRoute.js'
import ProductAPI from './routes/ProductRoute.js'
import AdminAPI from './routes/AdminRoutes.js'
import PaymentAPI from './routes/paymentRoutes.js'

dotenv.config();

import './utils/database.js'

const app = express();

app.use(express.json());
app.use(cors());

// major routes
app.use("/user",UserAPI);
app.use("/product",ProductAPI);
app.use("/admin",AdminAPI);
app.use("/payment",PaymentAPI);

app.get("/charge",async function (req, res){
    res.status(200).json({
        charge: CHARGE
    });
});


app.listen(process.env.EXPRESS_PORT, () =>{
    console.log("listening sucessfully",process.env.EXPRESS_PORT);
});


