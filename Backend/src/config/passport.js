import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import User from "../models/user.js";
import bcrypt from 'bcryptjs'


passport.use(new LocalStrategy(
    async function(username, password, done) {
        console.log(username,password)
        try {
            const user=await User.findOne({username})
            console.log(user)
            if(!user) return done(null,false,{message:"User not found"})
                const isMatch=await bcrypt.compare(password,user.password)
            if(isMatch) return done(null,user,{message:"User info retrieved"})
                else
            return done(null,false,{message:'Password is incorrect'})
        } catch (error) {
            return done(null,false,{message:error})
        }
    }
  ));

  passport.serializeUser((user,done)=>{
    done(null,user._id)
  })

  passport.deserializeUser(async (_id,done)=>{
    try {
        const user=await User.findById(_id)
        if(user)
            done(null,user)
    } catch (error) {
        done(null,error)
    }

  })