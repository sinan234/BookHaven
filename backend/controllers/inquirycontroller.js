const Inquiry = require("../models/inquirymodel");


const sendinquiry= async(req,res)=>{
    try{
      const {name,email,phone,message}=req.body
      const newinquiry=new Inquiry({name,email,phone,message})
      await newinquiry.save()
      return res.status(200).json({message:"Inquiry send successfully"});
    }catch (err) {
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  const updateinquiry= async(req,res)=>{
    try{
      const {id}=req.body
      const newinquiry=await Inquiry.findOne({_id:id})
      if(!newinquiry){
        return res.status(400).json({message:"No inquiry found"})
  
      }
      newinquiry.resolved=true;
      await newinquiry.save()
      return res.status(200).json({message:"Inquiry saved successfully"});
    }catch (err) {
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  const getinquiry= async(req,res)=>{
    try{
      const data=await Inquiry.find()
      if(!data){
        return res.status(400).json({message:"No inquiry found"})
      }
      return res.status(200).json({message:"Inquiry obtained successfully", data:data});
  
    }catch (err) {
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }

module.exports={sendinquiry, updateinquiry, getinquiry}