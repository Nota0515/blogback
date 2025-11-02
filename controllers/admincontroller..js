const pool = require('../config/db');


async function slug_genrator(title, pool) {
    const baseSlug = title
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace([/\s+/g, '-'])
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')

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

        const uniqueSlug = await slug_genrator(title, pool);
        const result = await pool.query('INSERT INTO blog (title , content , slug) VALUES( $1 , $2 , $3) RETURNING *', [title, content, uniqueSlug]);

        if (result.rows.length && result.rows > 0) {
            res.status(201).json({
                message: "Blog posted sucessfully",
                success: true
            })
        } else {
            res.status(500).json({
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
        res.status(500).json({
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