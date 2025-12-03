const express = require('express');
const Router = express.Router();
const { blogs, thisblog } = require('../controllers/blogcontroller');
const { auth } = require('../middleware/auth')

Router.get('/', (req, res) => {
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

Router.get('/blog/:slug', async (req, res) => {
  try {
    const { marked } = await import('marked');
    const Prism = (await import('prismjs')).default;
    await import('prismjs/components/prism-javascript.js');
    await import('prismjs/components/prism-css.js');
    await import('prismjs/components/prism-markup.js');


    const slug = req.params.slug;
    const sblog = await thisblog(slug);

    if (!sblog) {
      return res.status(404).render('404');
    };

    marked.setOptions({
      highlight: (code, lang) => {
        const Prism = require('prismjs');
        require('prismjs/components/prism-javascript');
        require('prismjs/components/prism-css');
        require('prismjs/components/prism-markup');
        const language = Prism.languages[lang] || Prism.languages.javascript;
        return Prism.highlight(code, language, lang);
      },
      langPrefix: 'language-',
    });


    sblog.htmlContent = marked(sblog.content);
    res.render('sblog', { sblog });
  } catch (error) {
    console.error(error);
    console.log("error in the datahelper of specific blog", error);
    res.status(500).send("error leading specific blog");
  }
});

//admin renders routes
Router.get('/admin/dashboard' , auth , async(req , res)=>{
  try {
    const blogdata = await blogs();
    res.render("dashboard" , { blogdata });
  } catch (error) {
    console.error("Error loading the admin Dasboard", error);
    res.redirect('/admin/login')
  }
});

Router.get('/admin/login', (req, res) => {
  res.render('login');
});


//experience wala route
Router.get('/exp', (req, res) => {
  res.render('workexp');
});



module.exports = Router;