const mongoose=require('mongoose')

const Chatschema=new mongoose.Schema({
    message: String,
    senderid: String,
    receigverid:String,
    time: String
})

const Chat=mongoose.model('Chat', Chatschema)
module.exports=Chat