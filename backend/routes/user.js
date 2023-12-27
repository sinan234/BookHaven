const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/usermodel");
const Post = require("../models/postmodel");
const Wishlist=require('../models/wishlistmodel')
const Like=require('../models/likemodel')
const Chat=require('../models/chatmodel')
const bcrypt = require('bcrypt');
const Request = require("../models/requestmodel");
const Warning=require('../models/warning')
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mpsinan015@gmail.com',
    pass: 'olvv wytw yrjq eulb'
  }
});
const sessionTimeout=1800000;

const otparray=[]

router.post('/send-otp', (req, res) => {
  
  function generateNumericOTP(length) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  function removeFirstOTPAfterTwoMinutes() {
    if (otparray.length > 0) {
      otparray.shift(); 
    }
  }
  const otp = generateNumericOTP(6);
  if (otp) {
    otparray.push(otp);
    setTimeout(removeFirstOTPAfterTwoMinutes, 2 * 60 * 1000);
  }
  const mailOptions = {
    from: 'mpsinan015@gmail.com',
    to: req.body.email,
    subject: 'BookHaven Community Bookstore- Email Verification',
    text: `Your OTP for email verification is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

router.post('/verify-otp', (req, res) => {
  const userOTP = req.body.otp; 
  console.log(otparray)
  if (otparray.includes(userOTP.toString())) {
    res.status(200).json({ message: 'OTP verification successful' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

router.post('/forgotpassword',async (req,res)=>{
  try{
    console.log(req.body.email)
    const user=await User.findOne({email:req.body.email})
    if(!user){
      return res.status(500).json({message:"User not found with the email"})
    }

    const userId=user._id
    
    const mailOptions = {
      from: 'mpsinan015@gmail.com',
      to: req.body.email,
      subject: 'BookHaven Community Bookstore - Password Reset',
      text: `Your Password reset link is http://localhost:4200/resetpassword/${userId}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send OTP' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  }catch (err) {
    res.status(500).json({ message: "Unknown error occured" });
  }
}
)

router.post('/resetpassword' ,async(req,res)=>{
  try{
     const user=await User.findOne({_id:req.body.userId})
     if(!user){
      return res.status(500).json({message:"User not found with the email"})
    }
    var bpassword= await bcrypt.hash(req.body.password, 10)
    user.password=bpassword
    await user.save()
    res.status(200).json({message:"Password updated successfully"})
  }catch (err) {
    res.status(500).json({ message: "Unknown error occured" });
  }
})

router.post("/create_user", async (req, res) => {
  try {
    var{name,password}=req.body
    var bpassword= await bcrypt.hash(password, 10)
    const exist= await User.findOne({name, bpassword})
    if(exist){
       res.status(500).json({message:"User already exists"})
    }
    const newuser = new User({
      name:req.body.name,
      email: req.body.email,
      password: bpassword,
      category1: req.body.category1,
      category2: req.body.category2,
      category3: req.body.category3,
      phone: req.body.phone,
      location:req.body.location,
      image:req.body.image,
      paymentid:req.body.paymentid,
      warning:0,
      active:'Yes'
    });
    await newuser.save();
    res.status(200).json({message:"User created successfully"})
  } catch (err) {
    res.status(500).json({ message: "Unknown error occured" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    if(user.active=='No'){
      return res.status(500).json({ message: "Your action is restricted within the website. Please contact the admin for more details" });

    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(500).json({ message: "Password is incorrect" });
    }
    const session = {
      userId: user._id,
      expiry: Date.now() + sessionTimeout
    };

    let token = jwt.sign(session, 'secretkey');
    const cookieValue = {
      token,
      sessionIndicator: true,
      sessionEnd: session.expiry
    };

    res.status(201).json({ message: "Authentication Successful", name: user.name, cookie: cookieValue });
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

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
    const request= await Request.find({recieverId:userId})
    
    res.status(200).json({
      message: "Details obtained successfully",
      posts: posts,
      user: user,
      wish: wishlist,
      alluser:alluser,
      request:request
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
      status:'Available',
      author:req.body.author,
      bookcategory:req.body.bookcategory,
      image:req.body.image,
      postdetails:req.body.postdetails,
      bookdetails:req.body.bookdetails,
      time:time,
      like:0,
      comment:0,
      wishlist:1,
      request:'None'

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

router.post('/sendrequest',async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const user=await User.findOne({_id: userId})
    const request= new Request({
      userId: userId,
      sendername:user.name,
      senderimage:user.image,
      recieverId:req.body.user_id,
      postId:req.body._id,
      bookname: req.body.bookname,
      author: req.body.author,
      duration:req.body.week,
      bookcategory: req.body.bookcategory,
      image: req.body.image,
      accepted: 'No',
      time: req.body.time,
      username: req.body.username,
      useremail: req.body.useremail,
      userimage: req.body.userimage,
      status:'Not Accepted'
    })
    await request.save()
    const post= await Post.findOne({_id:req.body._id})
    post.request='Request sent'
    await post.save()
    return res.status(201).json({message:"Request send successfully"})
  }catch(err){
    return res.status(500).json({message:"Unknown error occured"})

  }
})

router.get('/getuserbook', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const request = await Request.find();
    
    if (!request) {
      return res.status(500).json({ message: "Request not found" });

    } else {
      return res.status(200).json({ message: " request", data: request , id:userId});

    }
  } catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.get('/getRequest',async(req,res)=>{
  try{
    const token = req.headers.authorization.split(' ')[1];
    const id = jwt.verify(token, "secretkey");
    const userId = id.userId;
    const request = await Request.find({ recieverId:  userId+'' });
    const user=await User.find()
    return res.status(200).json({ message: " request", data: request , user:user });
  }catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
})

router.post('/acceptrequest', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.postId });
    if(post.status!='Available'){
      return res.status(500).json({message:"Book Already given"})
    }
    if (post) {
      post.status = req.body.accepted_time;
      post.request='Request Accepted'
      await post.save();
    }
    const request=await Request.findOne({_id: req.body._id})
    if(request.status=='Accepted'){
      return res.status(500).json({message:"Book Already given"})
    }
    request.status='Accepted'
    await request.save()
   
      return res.status(200).json({ message: "Request updated successfully" });
   
  } catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
})

router.delete('/removerequest/:data', async (req, res) => {
  try {
    const id = req.params.data;
    const deletedRequest = await Request.findOneAndDelete({ _id: id });

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }
});

router.post("/createwarning", async (req, res) => {
  try {

    const warn = await Warning.findOne({ userId: req.body.userId, senderId: req.body.senderId });
    if (warn) {
      return res.status(500).json({ message: "Only one report can be sent" });
    }
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.warning = (user.warning || 0) + 1;  
    await user.save();
    const warning = new Warning({
      userId: req.body.userId,
      senderId: req.body.senderId,
      reason: req.body.reason,
      sendername:user.name
    });
    await warning.save();
    console.log(warning)
    return res.status(200).json({ message: "Warning saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error occurred" });
  }
});


cron.schedule('0 12 * * *', async () => {
  try {
    const itemsToUpdate = await Post.find({ status: /^Available in \d+ days$/ });

    itemsToUpdate.forEach(async (item) => {
      const currentStatus = item.status;
      const daysLeft = parseInt(currentStatus.match(/\d+/)[0]);
      if (daysLeft > 1) {
        item.status = `Available in ${daysLeft - 1} days`;
      } else {
        item.status = "Available";
      }
      await item.save();
    });

    console.log('Status updated successfully');
  } catch (error) {
    console.error('Error updating status:', error);
  }
});

module.exports = router;
