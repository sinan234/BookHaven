const mongoose=require('mongoose')
const Userschema=new mongoose.Schema({
    email:String,
    password:String,
    phone:String,
    category1:String,
    category2:String,
    category3:String,
    location:String,
    paymentid:String,
    image:String,
    name:String,
    likedpost:Array,
    warning:Number,
    active:String
})
const User=mongoose.model('User', Userschema)
module.exports=User;