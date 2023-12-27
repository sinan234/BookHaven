const mongoose=require('mongoose');

const WarnSchema=new mongoose.Schema({
    userId:String,
    senderId:String,
    sendername:String,
    reason:String
})

const Warning=mongoose.model('Warning', WarnSchema)
module.exports=Warning