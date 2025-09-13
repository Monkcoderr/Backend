import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
 
app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

// routes importing

import userRouter from './routes/user.routes'

//  creating routes

app.use("/users",userRouter);






export { app }