import express from 'express'
//import { config } from 'dotenv';
import dotenv from "dotenv"

import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connection } from './database/connection.js';
import { errorMiddleWare } from './middleware/error.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import path from 'path';

import adminRoutes from "./routes/adminRutes.js"
import applicationRouter from './routes/applicationRouter.js'
import interviewRouter from './routes/interviewRouter.js'
import reportRoute from "./routes/reportRoutes.js"

import { newsLetterCron } from './automation/newsLetterCron.js';
import { scheduleJobDeletion } from './automation/cronJobs.js';
 const app=express()
 dotenv.config()
 const __dirname=path.resolve();

 app.use(cors(
  {
origin:[process.env.FRONTEND_URL],
methods:["GET","POST","PUT","DELETE"],
credentials:true
  }
 ));

 app.use(cookieParser());
 app.use(express.json());
 app.use(express.urlencoded({extended:true}))
 app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: "/temp/"
 }))


 connection();

 app.use("/api/v1/user",userRouter)
 app.use("/api/v1/job",jobRouter)
 app.use("/api/v1/application",applicationRouter)
 app.use("/api/v1/interview",interviewRouter)
 app.use("/api/v1/admin",adminRoutes)
 app.use("/api/v1",reportRoute)
 app.use(express.static(path.join(__dirname,"/frontend/dist")))
 app.get("*",(_,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))

 })
 newsLetterCron();
 scheduleJobDeletion();



 app.use(errorMiddleWare)

 export default app;