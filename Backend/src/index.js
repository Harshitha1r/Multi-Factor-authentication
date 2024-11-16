//passport-local for authentocation statergy
//speak-easy for multi factor authenticaion
import express, { json, urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport';
import connectMongoDB from './config/dbconnect.js';
import userRoutes from './routes/authRoutes.js';
import "./config/passport.js"
dotenv.config();
connectMongoDB();
const app=express();

app.use(cors({origin:["http://localhost:3001"],credentials:true}))
app.use(json({limit:'100mb'}))
app.use(urlencoded({limit:'100mb',extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET || 'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60000*60
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth',userRoutes)

const PORT=process.env.PORT || 7002
app.listen(PORT,()=>{
    console.log(`Connected to ${PORT}`)
})

