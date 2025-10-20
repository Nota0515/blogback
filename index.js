const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

//routes imports 
const adminroutes = require('./routes/admin');
const authroutes = require('./routes/auth');
const blogroutes = require('./routes/blog');

//setting up express
const app = express();

//buildin middleware use in applevel
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));


//initialixing the database here just like mongodb connecttoDB



//intialixing routes in application level
//app.use("/admin" , adminroutes);
app.use('/v1/auth' , authroutes);
//app.use('/v1/blogs', blogroutes);


app.get('/helloworld' , (req , res)=>{
    res.end("ooo chal geya bhai 😍 ")
})


const PORT = process.env.PORT || 5000 ;

app.listen(PORT , ()=>{
    console.log(`app is running on port ${PORT}`)
})