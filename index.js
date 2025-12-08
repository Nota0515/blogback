const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const path = require('path');

//routes imports 
const adminroutes = require('./routes/admin');
const authroutes = require('./routes/auth');
const blogroutes = require('./routes/blog');
const contactroutes = require('./routes/contact');

//views routes (SSR) 
const viewRoutes = require('./routes/views');

//setting up express
const app = express();

//buildin middleware use in applevel
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//static files 
app.use(express.static(path.join(__dirname , 'public')));

app.set("view engine" , "ejs");
app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "views/admin")]);

//ssr routes;
app.use('/' , viewRoutes);

//initialixing the database here just like mongodb connecttoDB no need for PostgresQL



//intialixing api routes in application level
app.use("/admin" , adminroutes);
app.use('/api/v1/auth' , authroutes);
app.use('/api/v1/blog', blogroutes);
app.use('/api/v1/contact', contactroutes);


app.get('/helloworld' , (req , res)=>{
    res.end("ooo chal geya bhai")
})

// 404 route (keep this at the very bottom)
app.use((req, res) => {
  res.status(404).render('404');
});



const PORT = process.env.PORT || 5000 ;

app.listen(PORT , ()=>{
    console.log(`app is running on port ${PORT}`)
})