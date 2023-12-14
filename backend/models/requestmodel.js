const mongoose = require("mongoose");
const RequestSchema = new mongoose.Schema({
  userId: String,
  sendername:String,
  senderimage:String,
  recieverId:String,
  postId: String,
  bookname: String,
  author: String,
  duration:String,
  bookcategory: String,
  image: String,
  postdetails: String,
  bookdetails: String,
  time: Number,
  username: String,
  useremail: String,
  userimage: String,
  status:String
});
const Request= mongoose.model('Request', RequestSchema)

module.exports= Request