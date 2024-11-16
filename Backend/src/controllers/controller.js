
import bcrypt from 'bcryptjs'
import User from '../models/user.js';
import speakeasy from 'speakeasy';
import qrCode from 'qrcode'
import jwt from 'jsonwebtoken'
export const RegisterUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        console.log(username,password)
        const hashedPass=await bcrypt.hash(password,10)
        const newUser=new User({
            username,
            password:hashedPass,
            isMFAActive:false
        })
        console.log(newUser)
        await newUser.save()
        res.status(200).json({message:"User registered successfully"})
        
    } catch (error) {
        res.status(500).json({error:`Unable to register user`,message:error})
    }
}
export const LoginUser=async(req,res)=>{
    console.log(req.user)
    res.status(200).json({
        message:'User Logged in successfully',
        username:req.user.username,
        isMFAActive:req.user.isMFAActive
    })
}
export const authStatus=async(req,res)=>{
    if(req.user){
        res.status(200).json({
            message:'User Logged in successfully',
            username:req.user.username,
            isMFAActive:req.user.isMFAActive 
        })
    }else{
        res.status(400).json({message:"Unauthorized User"})
    }
}
export const Fasetup=async(req,res)=>{
    try{
        const user=req.user
        var secret=speakeasy.generateSecret();
        user.twofactorsecret=secret.base32;
        user.isMFAActive=true;
        await user.save();
        const url=speakeasy.otpauthURL({
            secret:secret.base32,
            label:`${req.user.username}`,
            issuer:'www.harshitha.com',
            encoding:"base32"
        })
        const qrImage=await qrCode.toDataURL(url)
        res.status(200).json({message:"Setup successful",qrCode:qrImage})
    }catch(err){
        res.status(400).json({message:'error setting up'})
    }
}
export const Faverify=async(req,res)=>{
    const {token}=req.body;
    const user=req.user;
    const verfied=speakeasy.totp.verify({
        secret:user.twofactorsecret,
        encoding:'base32',
        token
    })
    console.log(verfied,"jj")
    if(verfied){
        const jwtToken=jwt.sign({username:user.username},process.env.JWT_TOKEN,{expiresIn:"1hr"})
        res.status(200).json({message:"User 2FA logged in",jwt:jwtToken})
    }else{
        res.status(400).json({message:"User not logged in"})
    }
}
export const Fareset=async(req,res)=>{
    try {
        const user=req.user
        user.twofactorsecret="";
        user.isMFAActive=false;
        await user.save();
        res.status(200).json({message:"user 2FA resetted"})
    } catch (error) {
        res.status(500).json({message:"user 2FA reset failes"})
    }
}
export const logout=async(req,res)=>{
    if(!req.user) res.status(400).json({message:"User not logged in"})
        req.logout(err=>{
    if(err) res.status(400).json({message:"User not logged in"})
        res.status(200).json({message:'User logged out'})
    })
}
