const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/usermodel");
const Post = require("../models/postmodel");
const Wishlist=require('../models/wishlistmodel')
const Like=require('../models/likemodel')
const Chat=require('../models/chatmodel')
const bcrypt = require('bcrypt');

const sessionTimeout=180000;

router.post("/create_user", async (req, res) => {
  try {
    var{name,password}=req.body
    var bpassword= await bcrypt.hash(password, 10)
    const exist= await User.findOne({name, bpassword})
    if(exist){
       res.status(500).json({message:"User already exists"})
    }
    const newuser = new User({
      email: req.body.email,
      password: bpassword,
      category1: req.body.category1,
      category2: req.body.category2,
      category3: req.body.category3,
      phone: req.body.phone,
      location:req.body.location,
      image:req.body.image,
      paymentid:req.body.paymentid
    });
    await newuser.save();
    res.status(200).json({message:"User created successfully"})
  } catch (err) {
    res.status(500).json({ message: "Unknown error occured" });
  }
});

router.post('/login',async(req,res)=>{
    try{
        const {email, password} =req.body
        const user= await User.findOne({email})
        if(!user){
            res.status(500).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(500).json({ message: "Password is incorrect" });
        }
        const session = {
            userId: user._id,
            expiry: Date.now() + sessionTimeout
          };
        
        let token=jwt.sign(session,'secretkey')
        const cookieValue = {
            token,
            sessionIndicator: true,
            sessionEnd: session.expiry
          };
      
          res.status(201).json({ message: "Authentication Successful" , name: user.name,cookie: cookieValue});

    }
    catch(error){
        res.status(500).json({ message: "Unknown error occured" });

    }
})

router.get('/getpost', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const alluser=await User.find()
    const user = await User.findOne({ _id: userId });
   
    if (!user) {
      res.status(500).json({ message: "User not found" });
    }
    const posts = await Post.find();
    if (!posts) {
      res.status(500).json({ message: "Posts not found" });
    }
    const wishlist = await Wishlist.find({ userId: userId });
    
    res.status(200).json({
      message: "Details obtained successfully",
      posts: posts,
      user: user,
      wish: wishlist,
      alluser:alluser
    });
  } catch (err) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.get('/getchating', async(req,res)=>{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });
    const alluser=await User.find()
    if (!user) {
      res.status(500).json({ message: "User not found" });
    }
    return res.status(200).json({message:"Successful",user:user, alluser:alluser})
  }catch (err) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
})

router.get('/getprofile' ,async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(500).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Details obtained successfully",
      user: user,
    });
  }catch(err){
    res.status(500).json({ message: "Unknown error occurred" });

  }
})

router.put('/profile/update', async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(500).json({ message: "User not found" });
    }
    user.name=req.body.name;
    user.category1=req.body.cat1;
    user.category2=req.body.cat2;
    user.category3=req.body.cat3;
    user.location=req.body.location;
    user.phone=req.body.phone;
    await user.save()

    res.status(200).json({
      message: "Details updated successfully",
    });
  }catch(err){
    res.status(500).json({ message: "Unknown error occurred" });

  }
})

router.post('/create_post', async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(500).json({ message: "User not found" });
    }
    const date=new Date();
    const time=date.getTime();
    const post=new Post({
      user_id:userId,
      username:user.name,
      useremail:user.email,
      userimage:user.image,
      bookname:req.body.bookname,
      author:req.body.author,
      bookcategory:req.body.bookcategory,
      image:req.body.image,
      postdetails:req.body.postdetails,
      bookdetails:req.body.bookdetails,
      time:time,
      like:0,
      comment:0,
      wishlist:1

    })
    await post.save();
    res.status(201).json({message:"Post saved succesffully"})
  }catch(err){
    res.status(500).json({ message: "Unknown error occurred" });

  }
})

router.put('/updatelike', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: req.body.postId });

    if (!post) {
      return res.status(500).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ userId: userId, postId: req.body.postId });

    if (existingLike) {
      await Like.deleteOne({ userId: userId, postId: req.body.postId }); 
      post.like -= 1;
      await post.save();

      return res.status(200).json({ message: 'Like removed successfully' });
    } else {
      const newLike = new Like({
        userId: userId,
        postId: req.body.postId
      });

      await newLike.save();
      post.like += 1;
      await post.save();

      return res.status(200).json({ message: 'Post liked successfully' });
    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.post('/create_wishlist', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const existingWishlist = await Wishlist.findOne({
      userId: userId,
      productId: req.body.postId
    });

    if (existingWishlist) {
      return res.status(500).json({ message: "Product already exists in the wishlist" });
    }

    const wish = new Wishlist({
      userId: userId,
      productId: req.body.postId
    });

    await wish.save();
    return res.status(200).json({ message: 'Product wishlisted successfully' });

  } catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.get('/getwishlist', async(req,res)=>{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const product=await Wishlist.find({userId:userId})
    const allproduct=await Post.find()
    res.status(200).json({
      message:"Products obtained successfully",
      products:product,
      allproduct:allproduct
    })
  }catch(err){
    return res.status(500).json({ message: "Unknown error occurred" });

  }

})

router.delete('/removewishlist/:id', async(req,res)=>{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const productId=req.params.id
    await Wishlist.deleteOne({
      userId:userId,
      productId:productId
    })
    res.status(201).json({message:"Product deleted successfully"})
}catch(err){
  return res.status(500).json({ message: "Unknown error occurred" });

}})

router.post('/addchat', async(req,res)=>{
  try{
     const{message,senderid,receigverid,time}=req.body
     const newChat = new Chat({ 
      message:message,
      senderid:senderid,
      receigverid:receigverid,
      time:time
     });
    await newChat.save()
    return res.status(201).json({message:"Post saved successfully"})
  }catch(err){
    return res.status(500).jsonn({message:"Unknown error occured"})
  }
})

router.get('/getchat',async(req,res)=>{
  try{
  const chat=await Chat.find()
  res.status(200).json({message:"Chat obtained successfully" , chat:chat})
}catch(err){
  return res.status(500).jsonn({message:"Unknown error occured"})

}})


module.exports = router;
