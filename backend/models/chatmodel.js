const mongoose = require('mongoose');

const Chatschema = new mongoose.Schema({
  message: String,
  senderid: String,
  receigverid: String,
  time: String
});

const NChat = mongoose.model('NChat', Chatschema);

module.exports = NChat;