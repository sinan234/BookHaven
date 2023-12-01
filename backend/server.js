const express=require('express');
const cors = require('cors');
const app=express();
const bodyParser = require('body-parser');
const db=require('./src/dbconnection')
const user =require('./routes/user')
const admin=require('./routes/admin')
app.use(bodyParser.json());
app.use(cors());

app.use('/user', user)
app.use('/admin' , admin)
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

db.connect()