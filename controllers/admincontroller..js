const pool = require('../config/db');


async function slug_genrator(title, pool) {
    const stopWords = ['a','an','the','and','or','but','if','then','else','when','at','by','for','in','of','on','to','up','from','with','as','is','it','that','this','your','my','our','their','be','are','was','were'];
    const baseSlug = title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g , '')
        .toLowerCase()
        .replace(/[^\w\s]/g , '')
        .split(/\s+/)
        .filter(word => word && !stopWords.includes(word))
        .slice(0,5)
        .join('-');

    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const result = await pool.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
        if (result.rows.length === 0) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};

exports.postblog = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status().json({
                message: "title and content required",
                success: false
            })
        };
        console.log(title);
        console.log(content);

        const uniqueSlug = await slug_genrator(title, pool);
        const result = await pool.query('INSERT INTO blogs (title , content , slug) VALUES( $1 , $2 , $3) RETURNING *', [title, content, uniqueSlug]);

        if (result.rows && result.rows.length > 0) {
            return res.status(201).json({
                message: "Blog posted sucessfully",
                success: true
            })
        } else {
            return res.status(500).json({
                message: "Error while posting blog",
                success: false
            });
        };
    } catch (error) {
        console.log(`Error while posting blog ${error}`);

        if (error.code === '23505') { // Unique violation
            return res.status(409).json({
                success: false,
                message: 'A blog post with this title already exists'
            });
        }
       return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
};

exports.updateblog = async (req, res) => { 
    try {
        
    } catch (error) {
        
    }
 };

exports.deleteblog = async (req, res) => { 
    try {
        const { slug } = req.params ;
        if (!slug) return res.status(400).json({
            message:'Slug required',
            success: false
        });
        const result = await pool.query('DELETE FROM blogs WHERE slug = $1 RETURNING *' , [slug]);

        if (result.rows.length > 0 ){
            return res.status(200).json({
                message : "blog post deleted sucesfully",
                success: true
            })
        }else{
            res.status(404).json({
                message: 'blog post not found',
                success: false
            })
        }

    } catch (error) {
        console.log(`Error while deleting : ${error}`);
        res.status(500).json({
            message:'Internal server error',
            success: false
        })
    }
 };