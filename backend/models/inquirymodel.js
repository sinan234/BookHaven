const mongoose=require('mongoose')
const Inschema=new mongoose.Schema({
   name: String,
   email:String,
   phone:String,
   message:String,
   resolved:{
    type:Boolean,
    default:false
   }

})

const Inquiry=mongoose.model('Inquiry', Inschema)
module.exports=Inquiry;