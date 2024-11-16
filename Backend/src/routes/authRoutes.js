import express from 'express';
import passport from 'passport';
import { RegisterUser,LoginUser,authStatus,Fareset,Fasetup,Faverify,logout } from '../controllers/controller.js';

const router=express.Router();

router.post('/signup',RegisterUser)
router.post('/login',passport.authenticate('local'),LoginUser)
router.get('/status',authStatus)

router.post('/2fa/setup',(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:'Unauthorized'})
},Fasetup);
router.post('/2fa/verify',(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:'Unauthorized'})
},Faverify);
router.post('/2fa/reset',Fareset)

router.post('/logout',logout)

export default router;