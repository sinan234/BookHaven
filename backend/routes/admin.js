const express=require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const timeout= 1800000;
const User=require('../models/usermodel')
const Wish=require('../models/wishlistmodel')
const Post= require('../models/postmodel');
const Warning = require('../models/warning');

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

router.get('/getdata', async (req, res) => {
  try {
    const users = await User.find();
    const wishlist = await Wish.find();
    const posts = await Post.find();
    const warnings = await Warning.find();

    if (!users || !posts || !wishlist || !warnings) {
      return res.status(500).json({ message: "Could not find data" });
    }

    res.status(200).json({
      message: "Data obtained successfully",
      user: users,
      post: posts,
      wishlist: wishlist,
      warnings: warnings
    });
  } catch (err) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.delete('/removeUser/:id',async(req,res)=>{
  try{
    const id=req.params.id
    const user=await User.findOne({_id:id})
    if(user.active=='No'){
      res.status(500).json({message:"User is already revoked"})

    }
    user.active='No'
    await user.save()
    return res.status(200).json({ message: "User's status updated successfully" });
  }catch(err){
    res.status(500).json({message:" Unknown error occured"})

  }
})

router.delete('/enableUser/:id',async(req,res)=>{
  try{
    const id=req.params.id
    const user=await User.findOne({_id:id})
    if(user.active=='Yes'){
      return res.status(500).json({message:"User is already active"})

    }
    user.active='Yes'
    await user.save()
    return res.status(200).json({ message: "User's status updated successfully" });
  }catch(err){
    res.status(500).json({message:" Unknown error occured"})

  }
})
module.exports=router