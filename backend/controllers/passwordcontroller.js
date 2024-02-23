const nodemailer = require('nodemailer');
const User = require('../models/usermodel');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mpsinan015@gmail.com',
      pass: 'olvv wytw yrjq eulb'
    }
  });

  const forgotPassword= async (req,res)=>{
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
                .reset-link {
                  margin-top: 20px;
                  text-align: center;
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
                  <p>We received a request to reset your password for your BookHaven Community Bookstore account.</p>
                  <p>To reset your password, please click the link below:</p>
                  <div class="reset-link">
                    <a href="http://localhost:4200/resetpassword/${userId}">Reset Password</a>
                  </div>
                  <p>If the link above doesn't work, you can copy and paste the following URL into your browser:</p>
                  <p>http://localhost:4200/resetpassword/${userId}</p>
                </div>
              </div>
            </body>
          </html>
        `
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

  const resetPassword=async(req,res)=>{
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
  }

  module.exports={forgotPassword, resetPassword}