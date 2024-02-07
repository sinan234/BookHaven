const mongoose = require('mongoose');

const Categoryschema = new mongoose.Schema({
   category: String,
},{timestamps:true});

const Category = mongoose.model('Category', Categoryschema);

module.exports = Category;