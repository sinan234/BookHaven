const express=require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const timeout= 1800000;
const User=require('../models/usermodel')
const Wish=require('../models/wishlistmodel')
const Post= require('../models/postmodel')
router.post('/login', async(req,res)=>{
    try{
      const {email,password}=req.body
      if(email !='admin' || password!='111111'){
         return res.status(500).json({message:"Invalid Admin Credentials"})
      }
      else {
        let payload = { id: "mkm" };
        const token = jwt.sign(payload, 'blah');
        res.status(200).json({ message: "Login Successful", token: token, time: Date.now() + timeout });
      }
    }catch(err){
        res.status(500).json({message:" Unknown error occured"})
    }
})

router.get('/getdata', async(req,res)=>{
  try{
    const user= await User.find()
    const wishlist= await Wish.find()
    const post=await Post.find();
    if(!user || !post || !wishlist){
      return res.status(500).json({message:"Could not find"})
    }
    res.status(200).json({message:"Data obtained successfully", user:user, post:post, wishlist:wishlist})
  }catch(err){
    res.status(500).json({message:" Unknown error occured"})

  }
})


module.exports=router