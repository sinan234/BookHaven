const express=require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const timeout= 1800000;
const nodemailer = require('nodemailer');
const User=require('../models/usermodel')
const Wish=require('../models/wishlistmodel')
const Post= require('../models/postmodel');
const Warning = require('../models/warning');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mpsinan015@gmail.com',
    pass: 'olvv wytw yrjq eulb'
  }
});

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
    const email= user.email
    if(user.active=='No'){
      res.status(500).json({message:"User is already revoked"})

    }
    user.active='No'
    await user.save()
    
    const mailOptions = {
      from: 'mpsinan015@gmail.com',
      to: email,
      subject: 'BookHaven Community Bookstore - Account Revocation',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
              }
              .logo {
                text-align: center;
                margin-bottom: 20px;
              }
              .content {
                color: #333;
              }
              .message {
                font-size: 18px;
                text-align: center;
                margin-top: 20px;
              }
              p{
                font-size: 18px;
              }
              .support {
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWQuXx6VelnEOU7yG16vGbhHFWWG6Pi7ynyGlVYhfq-wCHlyHkgS9wYOqkjk6xf_16sY8&usqp=CAU" alt="BookHaven Community Bookstore">
              </div>
              <div class="content">
                <p>Dear ${user.name},</p>
                <p>We regret to inform you that your account on BookHaven Community Bookstore has been revoked by the administrator for multiple reports against you.</p>
                <div class="message">
                  If you believe this is a mistake, please contact our support team fat <a href="mailto:bookhavensupport@gmail.com">bookhavensupport@gmail.com</a> for further assistance.
                </div>
              </div>
              <div class="support">
              <p>Best regards,</p>
              <p>The BookHaven Support Team</p>
            </div>
            </div>
          </body>
        </html>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send account revocation email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Account revocation email sent successfully' });
      }
    });
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