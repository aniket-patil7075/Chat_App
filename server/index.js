import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 7500;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))

app.use(cookieParser());
app.use(express.json());

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

mongoose.connect(databaseURL).then(()=>console.log(`DB Connection Successfull`)).catch((err)=>console.log(err.message))