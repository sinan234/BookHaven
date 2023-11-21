const mongoose=require('mongoose')
const Likeschema=new mongoose.Schema({
    userId:String,
    postId:String

})
const Like=mongoose.model('Like', Likeschema)
module.exports=Like;