const express = require('express');
const Router = express.Router();
const { blogs , thisblog } = require('../controllers/blogcontroller');

Router.get('/' , (req , res) =>{
    res.render('index');
});

Router.get("/blog", async (req, res) => {
  try {
    const blogdata = await blogs();
    res.render("blog", { blogdata });
  } catch (err) {
    console.error("Error loading blogs:", err);
    res.status(500).send("Error loading blog list");
  }
});

Router.get('/blog/:slug' , async(req , res)=> {
    try {
        const slug = req.params.slug ;
        const sblog = await thisblog(slug);

        if(!sblog){
            return res.status(404).render('404');
        };

        res.render('sblog' , {sblog});
    } catch (error) {
        console.error(error);
        console.log("error in the datahelper of specific blog" , error);
        res.status(500).send("error leading specific blog");
    }
});


Router.get('/exp' , (req ,res)=>{
    res.render('workexp');
});

module.exports = Router;