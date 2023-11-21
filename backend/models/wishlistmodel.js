const mongoose=require('mongoose')
const Wishschema=new mongoose.Schema({
    userId:String,
    productId:String

})

const Wishlist=mongoose.model('Wishlist', Wishschema)
module.exports=Wishlist;