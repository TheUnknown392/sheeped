import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("connection unsuccessful", err);
  });
