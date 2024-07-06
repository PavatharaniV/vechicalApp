const express = require('express');
const userRouter = require('./routes/user')

require('dotenv').config();

const app = express();
require('./models/db')

app.use(express.json())
app.use(userRouter);

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.listen(8000,()=>{
    console.log('Port is running');
})

