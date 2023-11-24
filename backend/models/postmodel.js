const mongoose=require('mongoose')
const Postschema=new mongoose.Schema({
    
user_id:String,
bookname:String,
author:String,
bookcategory:String,
image:String,
postdetails:String,
bookdetails:String,
time:Number,
like:Number,
comment:Number,
wishlist:Number,
username:String,
useremail:String,
userimage:String,


})
const Post=mongoose.model('Post', Postschema)
module.exports=Post;