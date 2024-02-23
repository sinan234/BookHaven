
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mpsinan015@gmail.com',
      pass: 'olvv wytw yrjq eulb'
    }
  });
  const sessionTimeout=1800000;
  
  const otparray=[]
  
  const sendOtp =(req, res) => {
  
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
      // text: `Your OTP for email verification is: ${otp}`
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
            .otp {
              font-size: 24px;
              font-weight: bold;
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
              <p>Dear ${req.body.name},</p>
              <p>Thank you for choosing BookHaven Community Bookstore. To complete your email verification, please use the OTP provided below.</p>
              <div class="otp">
                Your OTP for email verification is: ${otp}
              </div>
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
  };

  const verifyOtp=  (req, res) => {
    const userOTP = req.body.otp; 
    console.log(otparray)
    if (otparray.includes(userOTP.toString())) {
      res.status(200).json({ message: 'OTP verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  };


  
  module.exports={sendOtp, verifyOtp}