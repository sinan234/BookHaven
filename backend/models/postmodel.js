const mongoose=require('mongoose')
const Postschema=new mongoose.Schema({
    
user_id:String,
bookname:String,
author:String,
bookcategory:String,
image:String,
time:Number,
like:Number,
status:String,
comment:Number,
wishlist:Number,
username:String,
useremail:String,
userimage:String,
request:String,
postdetails:String,
bookdetails:String

})
const Post=mongoose.model('Post', Postschema)
module.exports=Post;