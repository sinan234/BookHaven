
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb+srv://sinanadoor:sin123@cluster0.czhaqhr.mongodb.net/BookHaven?retryWrites=true&w=majority', {
    
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; 
  }
}

module.exports = { connect };
