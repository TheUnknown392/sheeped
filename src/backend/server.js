import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

import UserAPI from './routes/UserRoute.js'

dotenv.config();

import './utils/database.js'

const app = express();

app.use(express.json());
app.use(cors());

// major routes
app.use("/user",UserAPI);


app.listen(process.env.DB_PORT, "localhost", () =>{
    console.log("listening sucessfully");
});


